import { AuthPayload } from "./types/auth-payload";
import { CreateUserInput, LoginInput } from "./types/create-user-input";
import { User, UserModel } from "./user-model";
import { Context } from "../utils/types/context";
import bcrypt from "bcrypt";
import {
  accessTokenPrivateKey,
  accessTokenPublicKey,
  refreshTokenPrivateKey,
  refreshTokenPublicKey,
  signJwt,
  verifyJwt,
} from "../utils/jwt";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../utils/cookies-options";
import { GraphQLError } from "graphql";
import { domain } from "../utils/types/error-code";

export class UserService {
  async signUp(input: CreateUserInput): Promise<User> {
    // check if the username is taken or if the email is taken
    const user: User = await UserModel.findOne({
      username: input.username,
      email: input.email.trim().toLowerCase(),
    }).lean();

    if (user) {
      throw new GraphQLError(
        "user with this username or email already exists",
        {
          extensions: { code: domain.USER_EXISTS },
        }
      );
    }

    // create a new user and hash it's password
    const newUser = Object.assign(new User(), input);
    return UserModel.create(newUser);
  }

  async login(input: LoginInput, context: Context): Promise<AuthPayload> {
    const errorMsg = "Invalid email or password";

    // Get our user by email
    const user: User = await UserModel.findOne({
      email: input.email.trim().toLowerCase(),
    }).lean();

    // if there is no user, throw an authentication error
    if (!user) {
      throw new GraphQLError(errorMsg, {
        extensions: { code: domain.UNAUTHENTICATED },
      });
    }

    // validate the password
    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
      throw new GraphQLError(errorMsg, {
        extensions: { code: domain.UNAUTHENTICATED },
      });
    }

    // sign a jwt
    const access_token = signJwt(user, accessTokenPrivateKey);
    const refresh_token = signJwt(user, refreshTokenPrivateKey);

    // Add Tokens to Context's cookies (note: we use cookie instead of local storage bcz it's more secure)
    context.res.cookie("access_token", access_token, accessTokenCookieOptions);
    context.res.cookie(
      "refresh_token",
      refresh_token,
      refreshTokenCookieOptions
    );

    // return token
    return { token: access_token, me: user };
  }

  async refreshAccessToken({ req, res }: Context): Promise<String> {
    // Get the refresh token
    const { refresh_token } = req.cookies;

    // Validate the RefreshToken
    const user = verifyJwt<User>(refresh_token, refreshTokenPublicKey);

    // sign a new access token
    const access_token = signJwt(user, accessTokenPrivateKey);

    // Send access token with cookies
    res.cookie("access_token", access_token, accessTokenCookieOptions);

    return access_token;
  }

  async getUser(token: string): Promise<User> {
    return verifyJwt<User>(token, accessTokenPublicKey);
  }

  async logout({ req, res }: Context): Promise<Boolean> {
    try {
      res.cookie("access_token", "", { maxAge: 0 });
      res.cookie("refresh_token", "", { maxAge: 0 });
      return true;
    } catch (error) {
      throw new GraphQLError(error);
    }
  }
}

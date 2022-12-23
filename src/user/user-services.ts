import { AuthPayload } from "./types/auth-payload";
import {
  AuthenticationError,
  ValidationError,
  ForbiddenError,
} from "apollo-server-core";
import { CreateUserInput, LoginInput } from "./types/create-user-input";
import { User, UserModel } from "./user-model";
import { Context } from "../utils/types/context";
import bcrypt from "bcrypt";
import {
  accessTokenExpiresIn,
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

export class UserService {
  async signUp(input: CreateUserInput): Promise<User> {
    // check if the username is taken or if the email is taken
    const user: User = await UserModel.findOne({
      username: input.username,
      email: input.email.trim().toLowerCase(),
    }).lean();

    if (user) {
      throw new ValidationError(
        "user with this username or email already exists"
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
      throw new AuthenticationError(errorMsg);
    }

    // validate the password
    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
      throw new AuthenticationError(errorMsg);
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
    const msg = "Could not refresh access token";
    // Get the refresh token
    const { refresh_token } = req.cookies;

    // Validate the RefreshToken
    const user = verifyJwt<User>(refresh_token, refreshTokenPublicKey);

    if (!user) {
      throw new ForbiddenError(msg);
    }

    // sign a new access token
    const access_token = signJwt(user, accessTokenPrivateKey);

    if (!access_token) {
      throw new ForbiddenError(msg);
    }
    // Send access token with cookies
    res.cookie("access_token", access_token, accessTokenCookieOptions);

    return access_token;
  }

  async getUser(token: string): Promise<User> {
    if (!token) throw new AuthenticationError("No access token found");

    const user = verifyJwt<User>(token, accessTokenPublicKey);

    if (!user) throw new AuthenticationError("Invalid access token");

    return user;
  }

  async logout({ req, res }: Context): Promise<Boolean> {
    try {
      res.cookie("access_token", "", { maxAge: 0 });
      res.cookie("refresh_token", "", { maxAge: 0 });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}

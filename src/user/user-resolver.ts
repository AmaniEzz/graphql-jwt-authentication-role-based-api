import { Context } from "../utils/types/context";
import { Query, Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { AuthPayload } from "./types/auth-payload";
import { CreateUserInput, LoginInput } from "./types/create-user-input";
import { User } from "./user-model";
import { UserService } from "./user-services";

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }
  @Query(() => User, { nullable: true })
  me(@Ctx() context: Context) {
    return context.user;
  }

  @Mutation(() => User)
  async signUp(@Arg("input") userInput: CreateUserInput): Promise<User> {
    return this.userService.signUp(userInput);
  }

  @Mutation(() => AuthPayload)
  async login(
    @Arg("input") userInput: LoginInput,
    @Ctx() context: Context
  ): Promise<AuthPayload> {
    return this.userService.login(userInput, context);
  }

  @Query(() => String)
  async refreshAccessToken(@Ctx() ctx: Context) {
    return this.userService.refreshAccessToken(ctx);
  }

  @Mutation(() => String)
  async logout(@Ctx() ctx: Context) {
    return this.userService.logout(ctx);
  }
}

import { Field, ObjectType } from "type-graphql";
import { User } from "../user-model";

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  token!: string;

  @Field(() => User)
  me!: User;
}

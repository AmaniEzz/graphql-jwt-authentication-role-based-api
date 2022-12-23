import { IsEmail, MaxLength, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Role } from "../user-model";

@InputType()
export class CreateUserInput {
  @Field(() => String, { nullable: false })
  username!: string;

  @IsEmail()
  @Field(() => String, { nullable: false })
  email!: string;

  @Field(() => String, { nullable: false })
  @MinLength(6, { message: "password must be at least 6 characters long" })
  @MaxLength(50, { message: "password must not be longer than 50 characters" })
  password!: string;

  @Field(() => [Role], { nullable: false })
  role!: Role[];
}

@InputType()
export class LoginInput {
  @IsEmail()
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;
}

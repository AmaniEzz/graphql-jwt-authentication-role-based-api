import { getModelForClass, prop, pre, index } from "@typegoose/typegoose";
import { modelOptions } from "@typegoose/typegoose/lib/modelOptions";
import bcrypt from "bcrypt";
import { ObjectId } from "mongoose";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

export enum Role {
  customer = "customer",
  admin = "admin",
}

registerEnumType(Role, {
  name: "Role",
});

@pre<User>("save", async function () {
  // Check that the password is being modified
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const password = this.password;
  const hashed = await bcrypt.hash(password, salt);
  this.password = hashed;
})
@index({ email: 1 })
@ObjectType()
@modelOptions({ schemaOptions: { collection: "user", timestamps: true } })
export class User {
  @Field(() => ID)
  _id!: ObjectId;

  @Field(() => String, { nullable: false })
  @prop({ required: true })
  username!: string;

  @Field(() => String)
  @prop({ required: false })
  firstName: string;

  @Field(() => String)
  @prop({ required: false })
  lastName: string;

  @Field(() => [Role], { nullable: false })
  @prop({ required: true, type: String })
  role!: Role[];

  @Field(() => String, { nullable: false })
  @prop({ required: true, lowercase: true })
  email!: string;

  @prop({ required: true })
  password!: string;
}

export const UserModel = getModelForClass(User);

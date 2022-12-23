import { prop } from "@typegoose/typegoose";
import { MaxLength, Min, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Category } from "../product-model";
import { Price } from "./create-product-input";

@InputType()
export class UpdateProductInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Price, { nullable: true })
  price?: Price;

  @Field(() => [Category], { nullable: true })
  category?: Category[];

  @Field(() => Number, { nullable: true })
  quantity?: number;

  @Field(() => Number, { nullable: true })
  purchaseCount?: number;

  @MinLength(50, {
    message: "Description must be at least 50 characters",
  })
  @MaxLength(1000, {
    message: "Description must not be more than 1000 characters",
  })
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [Number], { nullable: true })
  ratings?: number[];
}

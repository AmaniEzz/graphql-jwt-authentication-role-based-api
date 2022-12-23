import { prop } from "@typegoose/typegoose";
import { MaxLength, Min, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Category } from "../product-model";

@ObjectType()
@InputType("PriceInput")
export class Price {
  @Min(1)
  @Field(() => Number)
  @prop({ type: Number, required: true })
  amount!: number;

  @Field(() => String)
  @prop({ type: String, required: true })
  currency!: string;
}

@InputType()
export class CreateProductInput {
  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => Price, { nullable: false })
  price!: Price;

  @Field(() => [Category], { nullable: false })
  category!: Category[];

  @Field(() => Number, { nullable: true })
  quantity?: number;

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

import { Role } from "../user/user-model";
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import {
  Authorized,
  Field,
  ID,
  Float,
  ObjectType,
  registerEnumType,
} from "type-graphql";
import { ObjectId } from "mongoose";
import { Price } from "./types/create-product-input";

export enum Category {
  TechnologyAndElectronics = "Technology & Electronics",
  Fashion = "Fashion",
  HomeDecor = "Home décor",
  Food = "Food",
  BeautyAndPersonalCare = "Beauty & Personal Care",
  HealthcareAndFitness = "Healthcare & Fitness",
  Pets = "Pet products",
}

registerEnumType(Category, {
  name: "Category",
});

@ObjectType()
@modelOptions({ schemaOptions: { collection: "product", timestamps: true } })
export class Product {
  @Field(() => ID)
  _id!: ObjectId;

  @Field(() => String, { nullable: false })
  @prop({ required: true })
  name!: string;

  @Field(() => [Category], { nullable: false })
  @prop({ required: true, type: String })
  category!: Category[];

  @Field(() => Price, { nullable: false })
  @prop({ required: true, type: Price })
  price!: Price;

  @Field(() => String)
  @prop({ required: false })
  description: string;

  @Authorized() // restrict access to view purchases count only for logged users
  @Field(() => Number)
  @prop({ required: true, default: 0 })
  purchaseCount: number;

  @Authorized(Role.admin) // restrict access to view product quantity details for admin only
  @Field(() => Number)
  @prop({ required: true, default: 1, type: Number })
  quantity: number;

  @Authorized(Role.admin) // restrict access to rates details for admin only
  @Field(() => [Number], { nullable: true })
  @prop({ required: false, type: [Number] })
  ratings: number[];

  @Field(() => Float, { nullable: true })
  get averageRating(): number | null {
    if (this.ratings == undefined) return 0.0;
    else {
      return this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length;
    }
  }
}

export const ProductModel = getModelForClass(Product);

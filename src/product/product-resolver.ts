import { Role } from "../user/user-model";
import { Context } from "../utils/types/context";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Product } from "./product-model";
import { ProductService } from "./product-services";
import { CreateProductInput } from "./types/create-product-input";
import { UpdateProductInput } from "./types/update-product-input";

@Resolver()
export default class ProductResolver {
  constructor(private productService: ProductService) {
    this.productService = new ProductService();
  }

  // Only admins can add new products
  @Authorized(Role.admin)
  @Mutation(() => Product, { nullable: true })
  async createProduct(
    @Arg("input") input: CreateProductInput,
    @Ctx() ctx: Context
  ) {
    return this.productService.createProduct(input);
  }

  // Only admins can edit products
  @Authorized(Role.admin)
  @Mutation(() => Product)
  async updateProduct(
    @Arg("input") input: UpdateProductInput,
    @Arg("productId") productId: string,
    @Ctx()
    ctx: Context
  ) {
    return this.productService.updateProduct(productId, input);
  }

  // Only logged it users can rate a product
  @Authorized()
  @Mutation(() => Product, { nullable: true })
  async rateProduct(
    @Arg("productId") productId: string,
    @Arg("rate") rate: number,
    @Ctx()
    ctx: Context
  ) {
    return this.productService.rateProduct(productId, rate);
  }

  @Query(() => [Product], { nullable: true })
  async getProducts() {
    return this.productService.getProducts();
  }

  @Query(() => Product, { nullable: true })
  async getProduct(@Arg("productId") productId: string) {
    return this.productService.getProduct(productId);
  }
}

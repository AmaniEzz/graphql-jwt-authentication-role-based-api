import { Product, ProductModel } from "./product-model";
import { CreateProductInput } from "./types/create-product-input";
import { UpdateProductInput } from "./types/update-product-input";

export class ProductService {
  async createProduct(input: CreateProductInput): Promise<Product> {
    const newProduct = Object.assign(new Product(), input);
    return ProductModel.create(newProduct);
  }

  async updateProduct(
    productId: string,
    input: UpdateProductInput
  ): Promise<Product> {
    const product = await ProductModel.findByIdAndUpdate(productId, input, {
      new: true,
    })
      .lean()
      .orFail();
    return product;
  }

  async rateProduct(productId: string, rate: number): Promise<Product> {
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $push: { ratings: rate } },
      {
        new: true,
      }
    )
      .lean()
      .orFail();
    return product;
  }

  async getProducts(): Promise<Product[]> {
    // TODO: Pagination
    return ProductModel.find().lean();
  }

  async getProduct(productId: string): Promise<Product> {
    return ProductModel.findById(productId).lean();
  }
}

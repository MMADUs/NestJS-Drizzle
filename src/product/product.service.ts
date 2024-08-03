import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ProductDto } from '../common/types/entity/request/product.dto';
import * as schema from '../common/db/schema'
import { ProductResponse } from '../common/types/entity/response/product.types';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductService {
  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>
  ) {}

  async createProduct(payload: ProductDto): Promise<ProductResponse> {
    const [product] = await this.db.insert(schema.Product).values({
      name: payload.name,
      price: payload.price.toString(),
      stock: Number(payload.stock),
      available: payload.available,
      categoryId: payload.categoryId,
    }).returning();

    return this.entityToResponse(product);
  }

  async findAllProduct(): Promise<ProductResponse[]> {
    const productsWithCategories = await this.db.query.Product.findMany({
      with: {
        category: true
      }
    });

    return productsWithCategories.map(product => this.entityToResponse(product));
  }

  async findProductById(id: number): Promise<ProductResponse> {
    const product = await this.db.query.Product.findFirst({
      where: eq(schema.Product.id, id),
      with: {
        category: true
      }
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.entityToResponse(product);
  }

  async updateProduct(id: number, payload: Partial<ProductDto>): Promise<ProductResponse> {
    const [updatedProduct] = await this.db.update(schema.Product)
      .set({
        name: payload.name,
        price: payload.price?.toString(),
        stock: payload.stock !== undefined ? Number(payload.stock) : undefined,
        available: payload.available,
        categoryId: payload.categoryId,
      })
      .where(eq(schema.Product.id, id))
      .returning();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.entityToResponse(updatedProduct);
  }

  async deleteProduct(id: number): Promise<void> {
    const [deletedProduct] = await this.db.delete(schema.Product)
      .where(eq(schema.Product.id, id))
      .returning();

    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  private entityToResponse(
    product: typeof schema.Product.$inferSelect & {
      category?: typeof schema.Category.$inferSelect | null
    }
  ): ProductResponse {
    return {
      id: product.id,
      name: product.name,
      price: parseInt(product.price.toString()), // Assuming price is stored as a decimal
      stock: product.stock,
      available: product.available,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        createdAt: product.category.createdAt,
        updatedAt: product.category.updatedAt,
      } : null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}

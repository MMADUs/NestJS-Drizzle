import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../common/db/schema';
import { eq } from 'drizzle-orm';
import { CategoryDto } from '../common/types/entity/request/category.dto';
import { CategoryResponse } from '../common/types/entity/response/category.types';

@Injectable()
export class CategoryService {
  constructor(@Inject('DB') private db: NodePgDatabase<typeof schema>) {}

  async createCategory(payload: CategoryDto): Promise<CategoryResponse> {
    const [category] = await this.db.insert(schema.Category).values({
      name: payload.name,
    }).returning();

    return this.entityToResponse(category);
  }

  async findAllCategory(): Promise<CategoryResponse[]> {
    const categoriesWithProducts = await this.db.query.Category.findMany({
      with: {
        products: true
      }
    });

    return categoriesWithProducts.map(category => this.entityToResponse(category));
  }

  async findCategoryById(id: number): Promise<CategoryResponse> {
    const [category] = await this.db.select()
      .from(schema.Category)
      .where(eq(schema.Category.id, id));

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.entityToResponse(category);
  }

  async updateCategory(id: number, payload: Partial<CategoryDto>): Promise<CategoryResponse> {
    const [updatedCategory] = await this.db.update(schema.Category)
      .set({
        name: payload.name,
      })
      .where(eq(schema.Category.id, id))
      .returning();

    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.entityToResponse(updatedCategory);
  }

  async deleteCategory(id: number): Promise<void> {
    const [deletedCategory] = await this.db.delete(schema.Category)
      .where(eq(schema.Category.id, id))
      .returning();

    if (!deletedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  private entityToResponse(
    category: typeof schema.Category.$inferSelect & {
      products?: (typeof schema.Product.$inferSelect)[]
    }
  ): CategoryResponse {
    return {
      id: category.id,
      name: category.name,
      products: category.products ? category.products.map(product => ({
        id: product.id,
        name: product.name,
        price: parseInt(product.price.toString()),
        stock: product.stock,
        available: product.available,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })) : [],
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}

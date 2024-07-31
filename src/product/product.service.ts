import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ProductDto } from './product.dto';
import { Product } from '../db/schema'

@Injectable()
export class ProductService {
  constructor(@Inject('DB') private db: NodePgDatabase) {}

  async create(payload: ProductDto) {
    return this.db.insert(Product).values({
      name: payload.name,
      price: payload.price.toString(),
      stock: Number(payload.stock),
      available: payload.available,
    }).returning();
  }
}

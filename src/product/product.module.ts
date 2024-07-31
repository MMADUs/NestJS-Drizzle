import { Module } from '@nestjs/common';
import { DrizzleModule } from '../db/drizzle.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [DrizzleModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}

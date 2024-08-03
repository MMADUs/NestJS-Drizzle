import { Module } from '@nestjs/common';
import { DrizzleModule } from '../common/db/drizzle.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { GuardModule } from '../common/guard/guard.module';

@Module({
  imports: [
    DrizzleModule,
    GuardModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}

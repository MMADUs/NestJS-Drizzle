import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body(ValidationPipe) request: ProductDto) {
    return this.productService.create(request);
  }
}

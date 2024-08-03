import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  ValidationPipe,
  UseFilters, UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from '../common/types/entity/request/product.dto';
import { DataResponse } from '../common/types/http/response.types';
import { ProductResponse } from '../common/types/entity/response/product.types';
import { HttpExceptionFilter } from '../common/filter/httpException';
import { AuthGuard } from '../common/guard/auth.guard';

@Controller('product')
@UseFilters(HttpExceptionFilter)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(201)
  async create(
    @Body(ValidationPipe) request: ProductDto
  ): Promise<DataResponse<ProductResponse>> {
    const product = await this.productService.createProduct(request);
    return {
      data: product,
      message: "Product created successfully",
      errors: null,
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(200)
  async findAll(): Promise<DataResponse<ProductResponse[]>> {
    const products = await this.productService.findAllProduct()
    return {
      data: products,
      message: "Product find successfully",
      errors: null,
    }
  }

  @Get(':id')
  @HttpCode(200)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<DataResponse<ProductResponse>> {
    const product = await this.productService.findProductById(id);
    return {
      data: product,
      message: "Product found successfully",
      errors: null,
    };
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) request: Partial<ProductDto>
  ): Promise<DataResponse<ProductResponse>> {
    const product = await this.productService.updateProduct(id, request);
    return {
      data: product,
      message: "Product updated successfully",
      errors: null,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(
    @Param('id', ParseIntPipe) id: number
  ): Promise<DataResponse<ProductResponse>>{
    await this.productService.deleteProduct(id);
    return {
      data: null,
      message: "Product deleted successfully",
      errors: null,
    }
  }
}

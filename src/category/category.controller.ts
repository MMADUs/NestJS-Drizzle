import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../filter/httpException';
import { CategoryService } from './category.service';
import { DataResponse } from '../types/http/response.types';
import { CategoryDto } from './category.dto';
import { CategoryResponse } from '../types/entity/category.types';

@Controller('category')
@UseFilters(HttpExceptionFilter)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body(ValidationPipe) request: CategoryDto
  ): Promise<DataResponse<CategoryResponse>> {
    const category = await this.categoryService.createCategory(request);
    return {
      data: category,
      message: "Category created successfully",
      errors: null,
    }
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<DataResponse<CategoryResponse[]>> {
    const categories = await this.categoryService.findAllCategory()
    return {
      data: categories,
      message: "Categories find successfully",
      errors: null,
    }
  }

  @Get(':id')
  @HttpCode(200)
  async findById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<DataResponse<CategoryResponse>> {
    const category = await this.categoryService.findCategoryById(id);
    return {
      data: category,
      message: "Category found successfully",
      errors: null,
    };
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) request: Partial<CategoryDto>
  ): Promise<DataResponse<CategoryResponse>> {
    const category = await this.categoryService.updateCategory(id, request);
    return {
      data: category,
      message: "Category updated successfully",
      errors: null,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(
    @Param('id', ParseIntPipe) id: number
  ): Promise<DataResponse<CategoryResponse>>{
    await this.categoryService.deleteCategory(id);
    return {
      data: null,
      message: "Category deleted successfully",
      errors: null,
    }
  }
}

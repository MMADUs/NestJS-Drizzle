import { Product } from './product.types';

export class Category{
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CategoryResponse{
  id: number;
  name: string;
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
}
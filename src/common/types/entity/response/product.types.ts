import { Category } from './category.types';

export class Product{
  id: number;
  name: string;
  price: number;
  stock: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductResponse{
  id: number;
  name: string;
  price: number;
  stock: number;
  available: boolean;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}
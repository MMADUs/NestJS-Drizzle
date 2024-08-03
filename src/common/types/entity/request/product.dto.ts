import { IsString, IsNotEmpty, IsInt, IsBoolean, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  stock: number;

  @IsBoolean()
  @IsNotEmpty()
  available: boolean;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  categoryId: number;
}
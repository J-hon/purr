import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  product_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}

import { IsEmail, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  order_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

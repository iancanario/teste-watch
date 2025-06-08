import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ 
    description: 'Name of the product',
    example: 'Classic Watch Model X',
    minLength: 1
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Detailed description of the product',
    example: 'A classic watch with leather strap and stainless steel case',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Price of the product',
    example: 299.99,
    type: 'number',
    format: 'float',
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ 
    description: 'Initial stock quantity',
    example: 50,
    type: 'integer',
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  quantity: number;
}
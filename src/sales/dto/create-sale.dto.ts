import { Type } from "class-transformer";
import { IsArray, IsInt, IsUUID, Min, ValidateNested } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDto {
  @ApiProperty({ 
    description: 'List of products in the sale',
    type: () => [SaleItemDto],
    isArray: true
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  products: SaleItemDto[];
}

export class SaleItemDto {
  @ApiProperty({ 
    description: 'ID of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  productId: string;

  @ApiProperty({ 
    description: 'Quantity of the product',
    example: 2,
    type: 'integer',
    minimum: 1
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

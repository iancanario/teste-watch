import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({ description: 'Unique identifier of the product', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the product', example: 'Classic Watch Model X' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Detailed description of the product', required: false, example: 'A classic watch with leather strap and stainless steel case' })
  @Column('text', { nullable: true })
  description?: string;

  @ApiProperty({ description: 'Price of the product', example: 299.99, type: 'number', format: 'float' })
  @Column('decimal')
  price: number;

  @ApiProperty({ description: 'Current stock quantity', example: 50, minimum: 0 })
  @Column('int')
  quantity: number;

  @ApiProperty({ description: 'Date when the product was created', example: '2024-03-14T12:00:00Z' })
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the product was last updated', example: '2024-03-14T12:00:00Z' })
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

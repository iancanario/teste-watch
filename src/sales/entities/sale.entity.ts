import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SaleProduct } from "./sale-product.entity";
import { ApiProperty } from '@nestjs/swagger';

@Entity('sales')
export class Sale {
  @ApiProperty({ description: 'Unique identifier of the sale', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ 
    description: 'Employee who processed the sale',
    type: () => User
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  @ApiProperty({ description: 'ID of the employee who processed the sale', example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column({name: "employee_id"})
  employeeId: string;

  @ApiProperty({ 
    description: 'Products included in the sale',
    type: () => [SaleProduct],
    isArray: true
  })
  @OneToMany(() => SaleProduct, (sp) => sp.sale, { cascade: true })
  products: SaleProduct[];

  @ApiProperty({ description: 'Date when the sale was created', example: '2024-03-14T12:00:00Z' })
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the sale was last updated', example: '2024-03-14T12:00:00Z' })
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

import { Sale } from "src/sales/entities/sale.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';

export type UserRole = 'admin' | 'user';

export enum UserEnum {
  admin = "ADMIN",
  employee = "EMPLOYEE",
  seller = "SELLER",
  stock = "STOCK",
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier of the user', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Email address of the user', example: 'user@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Hashed password of the user', writeOnly: true })
  @Column()
  password: string;

  @ApiProperty({ 
    description: 'Role of the user',
    enum: UserEnum,
    example: UserEnum.employee,
    enumName: 'UserEnum'
  })
  @Column({ enum: UserEnum, default: UserEnum.employee })
  role: UserEnum;

  @ApiProperty({ description: 'Whether the user account is active', default: true })
  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @ApiProperty({ description: 'Date when the user was created', example: '2024-03-14T12:00:00Z' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the user was last updated', example: '2024-03-14T12:00:00Z' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  @ApiProperty({ description: 'Date when the user was deleted (if applicable)', example: '2024-03-14T12:00:00Z', required: false })
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
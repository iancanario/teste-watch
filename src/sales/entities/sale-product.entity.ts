import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sale } from "./sale.entity";

@Entity('sale_products')
export class SaleProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Sale, (sale) => sale.products)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @Column({ name: 'sale_id' })
  saleId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column('int')
  quantity: number;
}
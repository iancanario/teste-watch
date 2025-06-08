import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsSqsProducer } from './products.sqs-producer';
import { ISaleProducerPayload } from '../sales/sales.sqs-producer';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly productsSqsProducer: ProductsSqsProducer
  ) {}

  async create(dto: CreateProductDto) {
    if (dto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }
    if (dto.quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    const product = this.productRepo.create(dto);
    await this.productRepo.save(product);
    return { message: "created product" }
  }

  findAll() {
    return this.productRepo.find();
  }

  findOne(id: string) {
    return this.productRepo.findOneByOrFail({ id });
  }

  async updateAfterSale(id: string, quantity: number) {
    const product = await this.findOne(id);

    if (product.quantity < quantity) {
      this.productsSqsProducer.sendProductEvent('product.low-stock', product)
      throw new Error('Insufficient stock');
    }

    product.quantity -= quantity
    this.productsSqsProducer.sendProductEvent('product.updated', product)

    await this.productRepo.save(product);
  }

  async checkStock(id: string) {
    const product = await this.findOne(id);

    if (product.quantity < 10) {
      this.productsSqsProducer.sendProductEvent('product.low-stock', product)
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    if (dto.price !== undefined && dto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }
    if (dto.quantity !== undefined && dto.quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    const product = await this.productRepo.preload({ id, ...dto });
    if (!product) throw new NotFoundException('Product not found');
    this.productRepo.save(product);
    this.productsSqsProducer.sendProductEvent('product.updated', product)
    return { message: "updated product" }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return this.productRepo.remove(product);
  }
}

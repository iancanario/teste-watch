import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sale } from "./entities/sale.entity";
import { Repository } from "typeorm";
import { SaleProduct } from "./entities/sale-product.entity";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { User, UserEnum } from "src/users/entities/user.entity";
import { SalesSqsProducer } from "./sales.sqs-producer";

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private readonly saleRepo: Repository<Sale>,
    @InjectRepository(SaleProduct) private readonly saleProductRepo: Repository<SaleProduct>,
    private readonly salesSqsProducer: SalesSqsProducer,
  ) {}

  async createSale(user: any, dto: CreateSaleDto) {
    const sale = this.saleRepo.create({
      employeeId: user.userId,
      products: dto.products.map((p) =>
        this.saleProductRepo.create({ productId: p.productId, quantity: p.quantity }),
      ),
    });

    const saved = await this.saleRepo.save(sale);

    await this.salesSqsProducer.sendSaleEvent(
      'sale.created',
      {
        saleId: saved.id,
        employeeId: user.userId,
        products: dto.products,
      },
    );

    return saved;
  }
}

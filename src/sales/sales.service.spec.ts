import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleProduct } from './entities/sale-product.entity';
import { Repository } from 'typeorm';
import { SalesSqsProducer } from './sales.sqs-producer';
import { UserEnum } from '../users/entities/user.entity';
import { CreateSaleDto } from './dto/create-sale.dto';

describe('SalesService', () => {
  let service: SalesService;
  let saleRepo: Repository<Sale>;
  let saleProductRepo: Repository<SaleProduct>;
  let salesSqsProducer: SalesSqsProducer;

  const mockUser = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    role: UserEnum.seller,
  };

  const mockCreateSaleDto: CreateSaleDto = {
    products: [
      {
        productId: '123e4567-e89b-12d3-a456-426614174001',
        quantity: 2,
      },
      {
        productId: '123e4567-e89b-12d3-a456-426614174002',
        quantity: 1,
      },
    ],
  };

  const mockSale = {
    id: '123e4567-e89b-12d3-a456-426614174003',
    employeeId: mockUser.userId,
    products: mockCreateSaleDto.products.map(p => ({
      productId: p.productId,
      quantity: p.quantity,
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: getRepositoryToken(Sale),
          useValue: {
            create: jest.fn().mockReturnValue(mockSale),
            save: jest.fn().mockResolvedValue(mockSale),
          },
        },
        {
          provide: getRepositoryToken(SaleProduct),
          useValue: {
            create: jest.fn().mockImplementation((data) => data),
          },
        },
        {
          provide: SalesSqsProducer,
          useValue: {
            sendSaleEvent: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
    saleRepo = module.get<Repository<Sale>>(getRepositoryToken(Sale));
    saleProductRepo = module.get<Repository<SaleProduct>>(getRepositoryToken(SaleProduct));
    salesSqsProducer = module.get<SalesSqsProducer>(SalesSqsProducer);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSale', () => {
    it('should create a sale successfully', async () => {
      const result = await service.createSale(mockUser, mockCreateSaleDto);

      expect(result).toEqual(mockSale);
      expect(saleRepo.create).toHaveBeenCalledWith({
        employeeId: mockUser.userId,
        products: mockCreateSaleDto.products.map(p => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
      });
      expect(saleRepo.save).toHaveBeenCalled();
      expect(salesSqsProducer.sendSaleEvent).toHaveBeenCalledWith(
        'sale.created',
        {
          saleId: mockSale.id,
          employeeId: mockUser.userId,
          products: mockCreateSaleDto.products,
        },
      );
    });

    it('should handle errors during sale creation', async () => {
      const error = new Error('Database error');
      jest.spyOn(saleRepo, 'save').mockRejectedValue(error);

      await expect(service.createSale(mockUser, mockCreateSaleDto)).rejects.toThrow(error);
      expect(salesSqsProducer.sendSaleEvent).not.toHaveBeenCalled();
    });

    it('should handle errors during event sending', async () => {
      const error = new Error('SQS error');
      jest.spyOn(salesSqsProducer, 'sendSaleEvent').mockRejectedValue(error);

      await expect(service.createSale(mockUser, mockCreateSaleDto)).rejects.toThrow(error);
    });
  });
}); 
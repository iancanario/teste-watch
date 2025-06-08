import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UserEnum } from '../users/entities/user.entity';
import { ApiResponseDto } from '../common/dto/api-response.dto';

describe('SalesController', () => {
  let controller: SalesController;
  let salesService: SalesService;

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

  const mockSalesService = {
    createSale: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [
        {
          provide: SalesService,
          useValue: mockSalesService,
        },
      ],
    }).compile();

    controller = module.get<SalesController>(SalesController);
    salesService = module.get<SalesService>(SalesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a sale successfully', async () => {
      mockSalesService.createSale.mockResolvedValue(mockSale);

      const req = { user: mockUser };
      const result = await controller.create(mockCreateSaleDto, req);

      expect(result).toBeInstanceOf(ApiResponseDto);
      expect(result).toEqual({
        success: true,
        message: 'Sale created successfully',
        data: mockSale,
      });
      expect(salesService.createSale).toHaveBeenCalledTimes(1);
      expect(salesService.createSale).toHaveBeenCalledWith(mockUser, mockCreateSaleDto);
    });

    it('should handle errors during sale creation', async () => {
      const error = new Error('Failed to create sale');
      mockSalesService.createSale.mockRejectedValue(error);

      const req = { user: mockUser };
      await expect(controller.create(mockCreateSaleDto, req)).rejects.toThrow(error);
      expect(salesService.createSale).toHaveBeenCalledTimes(1);
      expect(salesService.createSale).toHaveBeenCalledWith(mockUser, mockCreateSaleDto);
    });
  });
}); 
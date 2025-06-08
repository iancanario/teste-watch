import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserEnum } from '../users/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    role: UserEnum.admin,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 0
      };

      mockService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createDto);

      expect(mockService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({
        success: true,
        message: 'Product created successfully',
        data: mockProduct,
      });
    });

    it('should handle service errors when creating a product', async () => {
      const createDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: -100,
        quantity: 0
      };

      mockService.create.mockRejectedValue(new BadRequestException('Invalid price'));

      await expect(controller.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [mockProduct];
      mockService.findAll.mockResolvedValue(products);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'Products retrieved successfully',
        data: products,
      });
    });

    it('should return an empty array when no products exist', async () => {
      mockService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'Products retrieved successfully',
        data: [],
      });
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne('1');

      expect(mockService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        success: true,
        message: 'Product retrieved successfully',
        data: mockProduct,
      });
    });

    it('should handle not found error', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException('Product not found'));

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 200,
      };

      const updatedProduct = { ...mockProduct, ...updateDto };
      mockService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update('1', updateDto);

      expect(mockService.update).toHaveBeenCalledWith('1', updateDto);
      expect(result).toEqual({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    });

    it('should handle not found error when updating', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
      };

      mockService.update.mockRejectedValue(new NotFoundException('Product not found'));

      await expect(controller.update('1', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      mockService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(mockService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        success: true,
        message: 'Product deleted successfully',
      });
    });

    it('should handle not found error when removing', async () => {
      mockService.remove.mockRejectedValue(new NotFoundException('Product not found'));

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
}); 
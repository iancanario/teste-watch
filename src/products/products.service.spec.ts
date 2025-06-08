import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductsSqsProducer } from './products.sqs-producer';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    quantity: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneByOrFail: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  const mockProductsSqsProducer = {
    sendProductEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
        {
          provide: ProductsSqsProducer,
          useValue: mockProductsSqsProducer,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      };

      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockResolvedValue(mockProduct);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ message: "created product" });
    });

    it('should throw BadRequestException when price is negative', async () => {
      const createDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: -100,
        quantity: 10,
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when stock is negative', async () => {
      const createDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: -10,
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [mockProduct];
      mockRepository.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(products);
    });

    it('should return an empty array when no products exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockRepository.findOneByOrFail.mockResolvedValue(mockProduct);

      const result = await service.findOne('1');

      expect(mockRepository.findOneByOrFail).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product is not found', async () => {
      mockRepository.findOneByOrFail.mockRejectedValue(new NotFoundException('Product not found'));

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 200,
      };

      const updatedProduct = { ...mockProduct, ...updateDto };
      mockRepository.preload.mockResolvedValue(updatedProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update('1', updateDto);

      expect(mockRepository.preload).toHaveBeenCalledWith({ id: '1', ...updateDto });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedProduct);
      expect(mockProductsSqsProducer.sendProductEvent).toHaveBeenCalledWith('product.updated', updatedProduct);
      expect(result).toEqual({ message: "updated product" });
    });

    it('should throw NotFoundException when product to update is not found', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
      };

      mockRepository.preload.mockResolvedValue(null);

      await expect(service.update('1', updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when updating with negative price', async () => {
      const updateDto: UpdateProductDto = {
        price: -200,
      };

      await expect(service.update('1', updateDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.preload).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(mockProductsSqsProducer.sendProductEvent).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when updating with negative quantity', async () => {
      const updateDto: UpdateProductDto = {
        quantity: -10,
      };

      await expect(service.update('1', updateDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.preload).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(mockProductsSqsProducer.sendProductEvent).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      mockRepository.findOneByOrFail.mockResolvedValue(mockProduct);
      mockRepository.remove.mockResolvedValue(mockProduct);

      await service.remove('1');

      expect(mockRepository.findOneByOrFail).toHaveBeenCalledWith({ id: '1' });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockProduct);
    });

    it('should throw NotFoundException when product to remove is not found', async () => {
      mockRepository.findOneByOrFail.mockRejectedValue(new NotFoundException('Product not found'));

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
}); 
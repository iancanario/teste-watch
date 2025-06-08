import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEnum } from './entities/user.entity';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    role: UserEnum.admin,
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        role: UserEnum.admin,
      };

      mockService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createDto);

      expect(mockService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({
        success: true,
        message: 'User created successfully',
        data: mockUser,
      });
    });

    it('should handle conflict error when email already exists', async () => {
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        role: UserEnum.admin,
      };

      mockService.create.mockRejectedValue(new ConflictException('Email already exists'));

      await expect(controller.create(createDto)).rejects.toThrow(ConflictException);
    });

    it('should handle bad request error for invalid input', async () => {
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        password: '123',
        role: UserEnum.admin,
      };

      mockService.create.mockRejectedValue(new BadRequestException('Password too short'));

      await expect(controller.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
      });
    });

    it('should return an empty array when no users exist', async () => {
      mockService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'Users retrieved successfully',
        data: [],
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(mockService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        success: true,
        message: 'User retrieved successfully',
        data: mockUser,
      });
    });

    it('should handle not found error', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateDto: UpdateUserDto = {
        email: 'updated@example.com',
      };

      const updatedUser = { ...mockUser, ...updateDto };
      mockService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateDto);

      expect(mockService.update).toHaveBeenCalledWith('1', updateDto);
      expect(result).toEqual({
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      });
    });

    it('should handle not found error when updating', async () => {
      const updateDto: UpdateUserDto = {
        email: 'updated@example.com',
      };

      mockService.update.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.update('1', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      mockService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(mockService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        success: true,
        message: 'User deleted successfully',
      });
    });

    it('should handle not found error when removing', async () => {
      mockService.remove.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});

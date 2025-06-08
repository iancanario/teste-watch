import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserEnum } from './entities/user.entity';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: any;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserEnum.admin,
    createdAt: new Date('2025-06-08T00:26:47.418Z'),
    updatedAt: new Date('2025-06-08T00:26:47.418Z'),
    isActive: true,
  } as User;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneByOrFail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        role: UserEnum.admin,
      };

      const createdUser = { ...mockUser, ...createDto, password: 'hashedPassword' };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(createdUser);
      mockRepository.save.mockResolvedValue(createdUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.create(createDto);

      expect(result).toEqual({ message: "created user" });
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: createDto.email } });
      expect(mockRepository.create).toHaveBeenCalledWith({
        email: createDto.email,
        password: 'hashedPassword',
        role: createDto.role,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        role: UserEnum.admin,
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when password is too short', async () => {
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        password: '123',
        role: UserEnum.admin,
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockRepository.findOneByOrFail.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOneByOrFail).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockRepository.findOneByOrFail.mockRejectedValue(new Error());

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto = {
      email: 'updated@example.com',
      password: 'newpassword123',
    };

    it('should update a user successfully', async () => {
      const updatedUser = { ...mockUser, ...updateDto, password: 'newHashedPassword' };
      mockRepository.findOneByOrFail.mockResolvedValueOnce(mockUser).mockResolvedValueOnce(updatedUser);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword' as never);

      const result = await service.update('1', updateDto);

      expect(result).toEqual(updatedUser);
      expect(mockRepository.update).toHaveBeenCalledWith('1', { ...updateDto, password: 'newHashedPassword' });
    });

    it('should throw NotFoundException when user to update is not found', async () => {
      mockRepository.findOneByOrFail.mockRejectedValue(new Error());

      await expect(service.update('1', updateDto)).rejects.toThrow(NotFoundException);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when password is too short', async () => {
      const updateWithShortPassword = { password: '123' };
      mockRepository.findOneByOrFail.mockResolvedValue(mockUser);

      await expect(service.update('1', updateWithShortPassword)).rejects.toThrow(BadRequestException);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when user to remove is not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});

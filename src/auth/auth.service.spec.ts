import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserEnum } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepo: Repository<User>;
  let jwtService: JwtService;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: UserEnum.admin,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock.jwt.token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepo = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        access_token: 'mock.jwt.token',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser.id,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(null);

      await expect(
        service.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

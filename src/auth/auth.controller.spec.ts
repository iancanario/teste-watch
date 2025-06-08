import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockToken = {
      access_token: 'mock.jwt.token',
    };

    it('should return success response with access token', async () => {
      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await controller.login(loginDto);

      expect(result).toBeInstanceOf(ApiResponseDto);
      expect(result).toEqual({
        success: true,
        message: 'Login successful',
        data: mockToken,
      });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should handle login failure', async () => {
      const error = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(error);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});

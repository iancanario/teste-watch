import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and get JWT token' })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully authenticated',
    type: ApiResponseDto,
    schema: {
      example: {
        success: true,
        message: 'Login successful',
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
    type: ApiResponseDto,
    schema: {
      example: {
        success: false,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      }
    }
  })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return new ApiResponseDto({
      success: true,
      message: 'Login successful',
      data: result
    });
  }
}

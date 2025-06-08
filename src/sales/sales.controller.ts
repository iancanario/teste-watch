import { Controller, Post, Body, Get, Param, UseGuards, Req, UsePipes } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserEnum } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { ValidationPipe } from '@nestjs/common';

@ApiTags('sales')
@ApiBearerAuth('JWT-auth')
@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(
    private readonly service: SalesService,
  ) {}

  @Post()
  @Roles(UserEnum.admin, UserEnum.seller)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiResponse({ 
    status: 201, 
    description: 'Sale successfully created',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data or insufficient stock',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Insufficient permissions',
    type: ApiResponseDto
  })
  async create(@Body() dto: CreateSaleDto, @Req() req: any) {
    const result = await this.service.createSale(req.user, dto);
    return new ApiResponseDto({
      success: true,
      message: 'Sale created successfully',
      data: result
    });
  }
} 
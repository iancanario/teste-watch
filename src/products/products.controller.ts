import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserEnum } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { Product } from './entities/product.entity';

@ApiTags('products')
@ApiBearerAuth('JWT-auth')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(
    private readonly service: ProductsService,
  ) {}

  @Post()
  @Roles(UserEnum.admin, UserEnum.stock)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ 
    status: 201, 
    description: 'Product successfully created',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Insufficient permissions',
    type: ApiResponseDto
  })
  async create(@Body() dto: CreateProductDto) {
    const result = await this.service.create(dto);
    return new ApiResponseDto({
      success: true,
      message: 'Product created successfully',
      data: result
    });
  }

  @Get()
  @Roles(UserEnum.admin, UserEnum.stock)
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all products',
    type: ApiResponseDto,
    isArray: true
  })
  async findAll() {
    const products = await this.service.findAll();
    return new ApiResponseDto({
      success: true,
      message: 'Products retrieved successfully',
      data: products
    });
  }

  @Get('/by-id/:id')
  @Roles(UserEnum.admin, UserEnum.stock)
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'string', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Product found',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found',
    type: ApiResponseDto
  })
  async findOne(@Param('id') id: string) {
    const product = await this.service.findOne(id);
    return new ApiResponseDto({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  }

  @Put(':id')
  @Roles(UserEnum.admin, UserEnum.stock)
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'string', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Product successfully updated',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found',
    type: ApiResponseDto
  })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const product = await this.service.update(id, dto);
    return new ApiResponseDto({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  }

  @Delete(':id')
  @Roles(UserEnum.admin, UserEnum.stock)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'string', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Product successfully deleted',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found',
    type: ApiResponseDto
  })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return new ApiResponseDto({
      success: true,
      message: 'Product deleted successfully'
    });
  }
}

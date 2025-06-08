import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserEnum } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly service: UsersService,
  ) {}

  @Post()
  @Roles(UserEnum.admin)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully created',
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
  async create(@Body() dto: CreateUserDto) {
    const result = await this.service.create(dto);
    return new ApiResponseDto({
      success: true,
      message: 'User created successfully',
      data: result
    });
  }

  @Get()
  @Roles(UserEnum.admin)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all users',
    type: ApiResponseDto,
    isArray: true
  })
  async findAll() {
    const users = await this.service.findAll();
    return new ApiResponseDto({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  }

  @Get('/by-id/:id')
  @Roles(UserEnum.admin)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'User found',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found',
    type: ApiResponseDto
  })
  async findOne(@Param('id') id: string) {
    const user = await this.service.findOne(id);
    return new ApiResponseDto({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  }

  @Put(':id')
  @Roles(UserEnum.admin)
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully updated',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found',
    type: ApiResponseDto
  })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.service.update(id, dto);
    return new ApiResponseDto({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  }

  @Delete(':id')
  @Roles(UserEnum.admin)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully deleted',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found',
    type: ApiResponseDto
  })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return new ApiResponseDto({
      success: true,
      message: 'User deleted successfully'
    });
  }
} 
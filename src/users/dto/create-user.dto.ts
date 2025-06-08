import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserEnum } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Email address of the user',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'User password',
    example: 'password123',
    minLength: 6,
    writeOnly: true
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    description: 'Role of the user',
    enum: UserEnum,
    example: UserEnum.employee,
    required: false,
    default: UserEnum.employee,
    enumName: 'UserEnum'
  })
  @IsOptional()
  @IsEnum(UserEnum)
  role?: UserEnum;
}

import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
  password: string;
}

import { Injectable, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    if (dto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ email: dto.email, password: hash, role: dto.role });
    await this.userRepo.save(user);
    return { message: "created user" };
  }

  async findAll(): Promise<User[]> {  
    return this.userRepo.find();
  }

  async findOne(id: string): Promise<User> {
    try {
      return await this.userRepo.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (dto.password) {
      if (dto.password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters long');
      }
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    await this.userRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
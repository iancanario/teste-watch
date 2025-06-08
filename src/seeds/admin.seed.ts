import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserEnum } from '../users/enums/user.enum';
import * as bcrypt from 'bcrypt';

export async function seedAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@example.com' }
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Create admin user
  const adminUser = userRepository.create({
    email: 'admin@example.com',
    password: await bcrypt.hash('admin123', 10),
    role: UserEnum.admin,
    isActive: true,
  });

  await userRepository.save(adminUser);
  console.log('Admin user created successfully');
} 
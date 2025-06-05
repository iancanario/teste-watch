import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'dev',
  password: process.env.DB_PASS || 'dev@1234',
  database: process.env.DB_NAME || 'watch',
  autoLoadEntities: true,
  synchronize: true,
};

export default config;

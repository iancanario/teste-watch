import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import typeormConfig from './config/typeorm.config';
import { ProductsModule } from './products/products.module';
import { SqsModule } from './messaging/sqs/sqs.module';
import { SalesModule } from './sales/sale.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeormConfig),
    AuthModule,
    UserModule,
    ProductsModule,
    SalesModule,
    SqsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

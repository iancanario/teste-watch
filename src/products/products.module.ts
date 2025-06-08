import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsSqsProducer } from './products.sqs-producer';
import { SQS } from 'aws-sdk';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ConfigModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsSqsProducer,
    {
      provide: 'SQS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new SQS({
          region: configService.get<string>('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID', ''),
            secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY', ''),
          },
        });
      },
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}

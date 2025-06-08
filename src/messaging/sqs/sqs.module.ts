import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SQS } from 'aws-sdk';
import { SqsService } from './sqs.service';
import { ProductUpdatedHandler } from './handlers/product-updated.handler';
import { SaleCreatedHandler } from './handlers/sale-created.handler';
import { ProductsModule } from '../../products/products.module';
import { ProductLowStockHandler } from './handlers/product-low-stock.handler';

@Module({
  imports: [ConfigModule, ProductsModule],
  providers: [
    SqsService,
    ProductUpdatedHandler,
    SaleCreatedHandler,
    ProductLowStockHandler,
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
})
export class SqsModule {}

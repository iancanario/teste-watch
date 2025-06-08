import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sale } from "./entities/sale.entity";
import { SaleProduct } from "./entities/sale-product.entity";
import { SalesController } from "./sales.controller";
import { SalesService } from "./sales.service";
import { SalesSqsProducer } from "./sales.sqs-producer";
import { SQS } from "aws-sdk";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleProduct]),
    ConfigModule
  ],
  controllers: [SalesController],
  providers: [
    SalesService, 
    SalesSqsProducer,
    {
      provide: 'SQS_CLIENT_SALE',
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
export class SalesModule {}
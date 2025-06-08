import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { ProductUpdatedHandler } from './handlers/product-updated.handler';
import { SaleCreatedHandler } from './handlers/sale-created.handler';
import { ProductLowStockHandler } from './handlers/product-low-stock.handler';
import { createLogger } from '../../config/logger.config';

@Injectable()
export class SqsService implements OnModuleInit {
  private readonly logger = createLogger().child({ service: 'SqsService' });
  private productQueueUrl: string;
  private saleQueueUrl: string;

  constructor(
    @Inject('SQS_CLIENT') private readonly sqs: SQS,
    private readonly configService: ConfigService,
    private readonly productUpdatedHandler: ProductUpdatedHandler,
    private readonly productLowStockHandler: ProductLowStockHandler,
    private readonly saleCreatedHandler: SaleCreatedHandler
  ) {
    this.productQueueUrl = this.configService.get<string>('SQS_PRODUCTS_QUEUE_URL') || '';
    this.saleQueueUrl = this.configService.get<string>('SQS_SALES_QUEUE_URL') || '';
  }

  async onModuleInit() {
    this.logger.info('Initializing SQS Consumer...');
    this.listenToQueue(this.productQueueUrl);
    this.listenToQueue(this.saleQueueUrl);
  }

  private async listenToQueue(queueUrl: string) {
    setInterval(async () => {
      try {
        const result = await this.sqs
          .receiveMessage({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 10,
          })
          .promise();

        if (!result.Messages || result.Messages.length === 0) return;

        for (const message of result.Messages) {
          await this.processMessage(message);

          await this.sqs
            .deleteMessage({
              QueueUrl: queueUrl,
              ReceiptHandle: message.ReceiptHandle!,
            })
            .promise();
        }
      } catch (err) {
        this.logger.error({ 
          error: err,
          queueUrl,
          operation: 'process_messages'
        }, 'Error processing SQS messages');
      }
    }, 5000);
  }

  private async processMessage(message: SQS.Message) {
    try {
      const body = JSON.parse(message.Body || '{}');
      this.logger.debug({ messageBody: body }, 'Processing SQS message');

      if (body.action === 'product.updated') {
        await this.productUpdatedHandler.handle(body.payload);
      } else if(body.action === 'sale.created'){ 
        await this.saleCreatedHandler.handle(body.payload);
      } else if(body.action === 'product.low-stock'){
        await this.productLowStockHandler.handle(body.payload);
      } else {
        this.logger.warn({ 
          action: body.action,
          messageId: message.MessageId 
        }, 'Unhandled event type received');
      }
    } catch (err) {
      this.logger.error({ 
        error: err,
        messageId: message.MessageId,
        operation: 'process_message'
      }, 'Error processing message');
    }
  }
}

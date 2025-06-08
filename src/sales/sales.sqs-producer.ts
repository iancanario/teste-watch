import { Inject, Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { createLogger } from '../config/logger.config';

export interface ISaleProducerPayload {
  saleId: string;
  employeeId: string;
  products: {productId: string, quantity: number}[]
}

@Injectable()
export class SalesSqsProducer {
  private readonly logger = createLogger().child({ service: 'SalesSqsProducer' });

  constructor(
    @Inject('SQS_CLIENT_SALE')
    private readonly sqs: SQS,
  ) {}

  async sendSaleEvent(action: 'sale.created' | 'sale.updated', payload: ISaleProducerPayload) {
    const queueUrl = process.env.SQS_SALES_QUEUE_URL;
    if (!queueUrl) {
      this.logger.error('SQS_SALES_QUEUE_URL environment variable is not defined');
      throw new Error('SQS_SALES_QUEUE_URL is not defined in environment variables');
    }

    const message = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({ action, payload }),
    };

    try {
      const result = await this.sqs.sendMessage(message).promise();
      this.logger.info({ 
        messageId: result.MessageId,
        action,
        saleId: payload.saleId,
        productCount: payload.products.length
      }, 'Sale event sent to SQS successfully');
    } catch (err) {
      this.logger.error({ 
        error: err,
        action,
        saleId: payload.saleId,
        operation: 'send_sale_event'
      }, 'Error sending sale event to SQS');
      throw err;
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { createLogger } from '../config/logger.config';

@Injectable()
export class ProductsSqsProducer {
  private readonly logger = createLogger().child({ service: 'ProductsSqsProducer' });

  constructor(
    @Inject('SQS_CLIENT')
    private readonly sqs: SQS,
  ) {}

  async sendProductEvent(action: 'product.low-stock' | 'product.updated', payload: any) {
    const queueUrl = process.env.SQS_PRODUCTS_QUEUE_URL;
    if (!queueUrl) {
      this.logger.error('SQS_PRODUCTS_QUEUE_URL environment variable is not defined');
      throw new Error('SQS_PRODUCTS_QUEUE_URL is not defined in environment variables');
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
        productId: payload.id
      }, 'Message sent to SQS successfully');
    } catch (err) {
      this.logger.error({ 
        error: err,
        action,
        productId: payload.id,
        operation: 'send_message'
      }, 'Error sending message to SQS');
      throw err;
    }
  }
}

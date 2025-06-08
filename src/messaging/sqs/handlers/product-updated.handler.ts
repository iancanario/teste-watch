import { Injectable } from '@nestjs/common';
import { createLogger } from '../../../config/logger.config';

@Injectable()
export class ProductUpdatedHandler {
  private readonly logger = createLogger().child({ service: 'ProductUpdatedHandler' });

  async handle(data: any) {
    this.logger.info({ 
      productId: data.id,
      updatedFields: Object.keys(data),
      timestamp: new Date().toISOString()
    }, 'Product updated successfully');
  }
}

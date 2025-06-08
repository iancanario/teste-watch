import { Injectable } from '@nestjs/common';
import { createLogger } from '../../../config/logger.config';

@Injectable()
export class ProductLowStockHandler {
  private readonly logger = createLogger().child({ service: 'ProductLowStockHandler' });

  async handle(data: any) {
    this.logger.info({ 
      productId: data.id,
      currentStock: data.stock,
      threshold: data.lowStockThreshold 
    }, 'Product stock level is low');
  }
}

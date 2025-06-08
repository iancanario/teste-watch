import { Injectable } from '@nestjs/common';
import { ProductsService } from '../../../products/products.service';
import { ISaleProducerPayload } from '../../../sales/sales.sqs-producer';
import { createLogger } from '../../../config/logger.config';

@Injectable()
export class SaleCreatedHandler {
  private readonly logger = createLogger().child({ service: 'SaleCreatedHandler' });

  constructor(
    private readonly productService: ProductsService
  ) {}

  async handle(data: ISaleProducerPayload) {
    this.logger.info({ 
      saleId: data.saleId,
      employeeId: data.employeeId,
      productCount: data.products.length,
      products: data.products
    }, 'Processing new sale');

    try {
      await Promise.all(
        data.products.map(product => 
          this.productService.updateAfterSale(product.productId, product.quantity)
        )
      );
      
      this.logger.info({ 
        saleId: data.saleId,
        status: 'completed'
      }, 'Sale processing completed successfully');
    } catch (error) {
      this.logger.error({ 
        error,
        saleId: data.saleId,
        operation: 'update_products_after_sale'
      }, 'Error processing sale');
      throw error;
    }
  }
}

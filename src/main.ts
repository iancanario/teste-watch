import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createLogger, PinoLogger } from './config/logger.config';

async function bootstrap() {
  const logger = createLogger();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false, // Disable Fastify's default logger
    }),
    {
      logger: new PinoLogger(logger),
    }
  );

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Watch Store API')
    .setDescription(`
      Watch Store API Documentation
      
      ## Overview
      This API provides endpoints for managing a watch store, including:
      - User management and authentication
      - Product inventory management
      - Sales processing
      - Real-time stock monitoring
      
      ## Authentication
      All endpoints require JWT authentication. Use the /auth/login endpoint to obtain a token.
      
      ## Roles
      The API supports different user roles:
      - ADMIN: Full access to all endpoints
      - STOCK: Access to product management
      
      ## Monitoring
      The API is instrumented with OpenTelemetry and can be monitored through Jaeger.
    `)
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('products', 'Product management endpoints')
    .addTag('sales', 'Sales management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000', 'Local Development')
    .addServer('https://api.watchstore.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    extraModels: [],
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Watch Store API Documentation',
  });

  await app.listen(3000, '0.0.0.0');
  logger.info('🚀 Application is running on http://localhost:3000');
  logger.info('📚 API Documentation available at http://localhost:3000/docs');
}
bootstrap();

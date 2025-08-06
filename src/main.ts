import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const logger = new Logger('Bootstrap'); 

  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3003;

    app.enableCors({
      origin: [
        'http://localhost:3001',
        'https://tcc-frontend-flax.vercel.app',
        'http://localhost:3002',
      ],
    });

    logger.log('Starting all microservices...');
    await app.startAllMicroservices();
    logger.log('All microservices started successfully.');

    await app.listen(port);
    logger.log(`Application is running successfully on port: ${port}`);
  } catch (error) {
    logger.error('Failed to bootstrap the application.', error.stack);
    process.exit(1); 
  }
}

bootstrap();

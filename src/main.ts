import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const logger = new Logger('Bootstrap'); 

  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3000;

    app.enableCors({
      origin: '*',
    });

    await app.listen(port);
    logger.log(`Application is running successfully on port: ${port}`);
  } catch (error) {
    logger.error('Failed to bootstrap the application.', error.stack);
    process.exit(1); 
  }
}

bootstrap();

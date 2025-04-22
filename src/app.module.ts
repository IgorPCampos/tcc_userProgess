import { AppController } from './test.controller';
import { ClassModule } from './class/class.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQProducerService } from './utils/rabbitmq-producer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB || ''),
    ClassModule,
    
  ],
  controllers: [AppController],
  providers: [RabbitMQProducerService],
})
export class AppModule {}

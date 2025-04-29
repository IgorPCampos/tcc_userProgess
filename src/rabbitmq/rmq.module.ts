import { Module } from '@nestjs/common';
import { RabbitMQProducerToEducationService } from './producers/rmq.to_education';
import { RabbitMQToGameConsumer } from './consumers/rmq.to_game';

@Module({
  controllers: [],
  providers: [RabbitMQProducerToEducationService, RabbitMQToGameConsumer],
  exports: [RabbitMQProducerToEducationService, RabbitMQToGameConsumer],
})
export class RabbitMQModule {}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ServerRMQ } from '@nestjs/microservices';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

@Injectable()
export class RabbitMQToGameConsumer extends ServerRMQ implements OnModuleInit {
  constructor() {
    super({
      urls: [process.env.RABBITMQ_URI!],
      queue: 'to_game',
      queueOptions: {
        durable: true,
      },
      noAck: false,
      prefetchCount: 1, 
    });
  }

  async onModuleInit() {
    await this.listen(() => {
      console.log('📡 RabbitMQ Consumer connected and listening!');
    });
  }

  @MessagePattern('to_game')
  async handleMessage(@Payload() message: any) {
    console.log('📩 Raw message received from to_game');

    const content = JSON.parse(message.content.toString());
    console.log('📩 Parsed message content:', content.data);

    return;
  }
}

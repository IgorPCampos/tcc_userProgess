import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitMQProducerService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URI!],
        queue: 'to_education',
        queueOptions: { durable: true },
      },
    });
  }

  async sendMessage(message: string) {
    console.log(`📤 Sending message: ${message}`);
    return this.client.emit('to_education', message);
  }
}

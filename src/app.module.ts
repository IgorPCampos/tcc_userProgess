import { ClassModule } from './class/class.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB || ''),
    ClassModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

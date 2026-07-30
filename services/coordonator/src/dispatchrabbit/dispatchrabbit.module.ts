import { Module } from '@nestjs/common';
import { RabbitModule } from '../rabbit/rabbit.module';
import { DispatchRabbitController } from './dispatchrabbit.controller';

@Module({
    imports: [RabbitModule],
    controllers: [DispatchRabbitController],
})
export class DispatchRabbitModule {}
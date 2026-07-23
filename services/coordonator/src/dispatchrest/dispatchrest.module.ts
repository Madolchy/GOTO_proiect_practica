import { Module } from '@nestjs/common';
import { DispatchRestController } from './dispatchrest.controller';
import { RabbitModule } from '../rabbit/rabbit.module';

@Module({
    imports: [RabbitModule],
    controllers: [DispatchRestController],
})
export class DispatchRestModule {}

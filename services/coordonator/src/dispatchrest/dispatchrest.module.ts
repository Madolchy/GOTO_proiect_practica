import { Module } from '@nestjs/common';
import { DispatchRestController } from './dispatchrest.controller';
import { RabbitModule } from '../rabbit/rabbit.module';
import { DispatchRestService } from './dispatchrest.service';

@Module({
    imports: [RabbitModule],
    controllers: [DispatchRestController],
    providers: [DispatchRestService],
})
export class DispatchRestModule {}

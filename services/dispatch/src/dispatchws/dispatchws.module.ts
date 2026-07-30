import { Module } from '@nestjs/common';
import { DispatchWSGateway } from './dispatchws.gateway';
import { RideEventsController } from './ride-events.controller';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { DispatchWSService } from './dispatchws.service';

@Module({
    imports: [RabbitModule],
    controllers: [RideEventsController],
    providers: [DispatchWSGateway, DispatchWSService],
})
export class DispatchWSModule {}

import { Module } from '@nestjs/common';
import { DispatchSSEController } from './dispatchsse.controller';
import { DispatchSSEService } from './dispatchsse.service';

@Module({
    controllers: [DispatchSSEController],
    providers: [DispatchSSEService],
    exports: [DispatchSSEService],
})
export class DispatchSSEModule {}

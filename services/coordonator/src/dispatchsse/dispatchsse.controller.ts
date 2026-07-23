import { Controller, Sse, Param } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { DispatchSSEService } from './dispatchsse.service';

@Controller('dispatch')
export class DispatchSSEController {
    constructor(private readonly sseService: DispatchSSEService) {}

    @Sse('sse/:rideId')
    sse(@Param('rideId') rideId: string): Observable<MessageEvent> {
        // sse(@Param('rideId') rideId: string): any {
        // console.log('Initiated a sse connection with: ', rideId);
        return this.sseService.subscribe(rideId);
    }

    @EventPattern('driver.found')
    onDriverFound(@Payload() msg: { rideId: string; driverId: string }) {
        console.log('Found driver! Sending to client frontend');
        this.sseService.push(msg.rideId, { driverId: msg.driverId });
    }
}

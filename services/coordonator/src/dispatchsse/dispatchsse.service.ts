
import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { MessageEvent } from '@nestjs/common';

@Injectable()
export class DispatchSSEService {
    private readonly streams = new Map<string, Subject<MessageEvent>>();

    subscribe(rideId: string): Observable<MessageEvent> {
        let subject = this.streams.get(rideId);
        if (!subject) {
            subject = new Subject<MessageEvent>();
            this.streams.set(rideId, subject);
        }
        return subject.asObservable();
    }

    // Called by the @EventPattern handler
    push(rideId: string, data: string | object, event = 'driver.found'): void {
        this.streams.get(rideId)?.next({ type: event, data });
    }

    complete(rideId: string): void {
        this.streams.get(rideId)?.complete();
        this.streams.delete(rideId);
    }
}

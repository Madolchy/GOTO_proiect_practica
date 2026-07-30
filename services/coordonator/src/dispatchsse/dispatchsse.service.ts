
import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { MessageEvent } from '@nestjs/common';

@Injectable()
export class DispatchSSEService {
    private readonly streams = new Map<string, Subject<MessageEvent>>();

    subscribe(userId: string): Observable<MessageEvent> {
        let subject = this.streams.get(userId);
        if (!subject) {
            subject = new Subject<MessageEvent>();
            this.streams.set(userId, subject);
        }
        return subject.asObservable();
    }

    // Called by the @EventPattern handler
    push(userId: string, data: string | object, event = 'driver.found'): void {
        this.streams.get(userId)?.next({ type: event, data });
    }

    complete(userId: string): void {
        this.streams.get(userId)?.complete();
        this.streams.delete(userId);
    }
}

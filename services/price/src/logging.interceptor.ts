// logging.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    // We give it a context name ('HTTP') so it displays nicely in the console
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const request = ctx.getRequest();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { method, url } = request;
        const now = Date.now();

        // The next.handle() stream processes the request.
        // We use .pipe(tap(...)) to run code *after* the controller finishes execution.
        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - now;
                this.logger.log(`${method} ${url} - Finished in ${duration}ms`);
            }),
        );
    }
}

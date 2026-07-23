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
    private readonly logger = new Logger('App');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const type = context.getType();
        const now = Date.now();
        const label = this.labelFor(context, type);

        return next.handle().pipe(
            tap(() => {
                this.logger.log(`${label} - Finished in ${Date.now() - now}ms`);
            }),
        );
    }

    private labelFor(context: ExecutionContext, type: string): string {
        if (type === 'http') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const request = context.switchToHttp().getRequest();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return `${request.method} ${request.url}`;
        }
        if (type === 'rpc') {
            const className = context.getClass()?.name ?? 'Unknown';
            const handlerName = context.getHandler()?.name ?? 'Unknown';
            return `gRPC ${className}.${handlerName}`;
        }
        return `${String(type)} ${context.getHandler()?.name ?? 'Unknown'}`;
    }
}

import { NestFactory } from '@nestjs/core';
import type { Express } from 'express';
import { AppModule } from './app.module';
import { ConnectMiddleware } from './connect/connect.middleware';
import { LoggingInterceptor } from './logging.interceptor';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.useGlobalInterceptors(new LoggingInterceptor());

    const expressApp = app.getHttpAdapter().getInstance() as Express;
    const connectMiddleware = app.get(ConnectMiddleware);
    expressApp.use(connectMiddleware.use.bind(connectMiddleware));

    app.connectMicroservice({
        transport: Transport.REDIS,
        options: { host: 'localhost', port: 6379 },
    });

    await app.startAllMicroservices();
    await app.listen(process.env.PORT ?? 3020);

    console.log('Listening on: ', process.env.PORT ?? 3020);
}

void bootstrap();
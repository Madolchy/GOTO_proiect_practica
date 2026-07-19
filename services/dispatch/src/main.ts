import { NestFactory } from '@nestjs/core';
import type { Express } from 'express';
import { AppModule } from './app.module';
import { ConnectMiddleware } from './connect/connect.middleware';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    const expressApp = app.getHttpAdapter().getInstance() as Express;
    const connectMiddleware = app.get(ConnectMiddleware);
    expressApp.use(connectMiddleware.use.bind(connectMiddleware));

    await app.listen(process.env.PORT ?? 3020);

    console.log('Listening on: ', process.env.PORT ?? 3020);
}

void bootstrap();

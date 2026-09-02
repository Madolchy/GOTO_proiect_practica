import { NestFactory } from '@nestjs/core';
import type { Express } from 'express';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ConnectMiddleware } from './connect/connect.middleware';
import { LoggingInterceptor } from './logging.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.useGlobalInterceptors(new LoggingInterceptor());

    const config = app.get(ConfigService);
    const grpcUrl = config.getOrThrow<string>('DISPATCH_GRPC_URL');

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'goto.v1',
            protoPath: require.resolve('@goto/proto/proto/driver_location.proto'),
            url: grpcUrl,
            loader: {
                arrays: true,
            },
        },
    });
    await app.startAllMicroservices();
    Logger.log('gRPC server listening on: ' + grpcUrl);

    const expressApp = app.getHttpAdapter().getInstance() as Express;
    const connectMiddleware = app.get(ConnectMiddleware);
    expressApp.use(connectMiddleware.use.bind(connectMiddleware));

    await app.listen(process.env.PORT ?? 3020);

    console.log('Listening on: ', process.env.PORT ?? 3020);
}

void bootstrap();

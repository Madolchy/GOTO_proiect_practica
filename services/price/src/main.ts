import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import path from 'path';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'goto.v1',
            protoPath: path.join(__dirname, 'proto/price.proto'),
            url: '0.0.0.0:5200',
        },
    });
    await app.startAllMicroservices();
    Logger.log('gRPC server listening on 0.0.0.0:5200');

    await app.listen(process.env.PORT ?? 3000);
    Logger.log('HTTP server is running at port: ' + (process.env.PORT ?? 3000));
}
void bootstrap();

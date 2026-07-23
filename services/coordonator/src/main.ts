import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logging.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.REDIS,
        options: { host: 'localhost', port: 6379 },
    });

    app.useGlobalInterceptors(new LoggingInterceptor());
    app.enableCors({});
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    await app.startAllMicroservices();
    await app.listen(process.env.PORT ?? 3030);
}
void bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(process.env.PORT ?? 3000);

    Logger.log('Server is running at port: ' + (process.env.PORT ?? 3000));
}
void bootstrap();

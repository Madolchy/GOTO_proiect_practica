import { Module } from '@nestjs/common';
import { resolve } from 'node:path';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectModule } from './connect/connect.module';
import { RabbitModule } from './rabbit/rabbit.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { DispatchWSModule } from './dispatchws/dispatchws.module';
import { RedisModule } from './redis/redis.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: resolve(__dirname, '../../../.env'),
        }),
        RedisModule,
        RabbitModule,
        ConnectModule,
        DispatchModule,
        DispatchWSModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
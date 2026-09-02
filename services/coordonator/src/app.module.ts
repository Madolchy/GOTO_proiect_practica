import { Module } from '@nestjs/common';
import { resolve } from 'node:path';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PriceModule } from './price/price.module';
import { RabbitModule } from './rabbit/rabbit.module';
import { DispatchRabbitModule } from './dispatchrabbit/dispatchrabbit.module';
import { DispatchRestModule } from './dispatchrest/dispatchrest.module';
import { DispatchSSEModule } from './dispatchsse/dispatchsse.module';
import { DispatchGrpcModule } from './dispatchgrpc/dispatchgrpc.module';
import { RedisModule } from './redis/redis.module';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: resolve(__dirname, '../../../.env'),
        }),
        ScheduleModule.forRoot(),
        RedisModule,
        RabbitModule,
        PriceModule,
        DispatchRabbitModule,
        DispatchRestModule,
        DispatchSSEModule,
        DispatchGrpcModule,
        DrizzleModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

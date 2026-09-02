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
import { ScheduleModule } from '@nestjs/schedule';
import { DispatchCronModule } from './dispatchCron/dispatchCron.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { DriverPositionsGrpcModule } from './driver-positions/grpc/driver-positions-grpc.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: resolve(__dirname, '../../../.env'),
        }),
        ScheduleModule.forRoot(),
        RedisModule,
        RabbitModule,
        ConnectModule,
        DispatchModule,
        DispatchWSModule,
        DispatchCronModule,
        DrizzleModule,
        DriverPositionsGrpcModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectModule } from './connect/connect.module';
import { RabbitModule } from './rabbit/rabbit.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { DispatchWSModule } from './dispatchws/dispatchws.module';

@Module({
    imports: [RabbitModule, ConnectModule, DispatchModule, DispatchWSModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

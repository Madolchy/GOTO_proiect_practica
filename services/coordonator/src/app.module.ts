import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PriceModule } from './price/price.module';
import { RabbitModule } from './rabbit/rabbit.module';
import { DispatchRabbitModule } from './dispatchrabbit/dispatchrabbit.module';
import { DispatchRestModule } from './dispatchrest/dispatchrest.module';
import { DispatchSSEModule } from './dispatchsse/dispatchsse.module';

@Module({
    imports: [
        RabbitModule,
        PriceModule,
        DispatchRabbitModule,
        DispatchRestModule,
        DispatchSSEModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

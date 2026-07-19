import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RidepriceModule } from './rideprice/rideprice.module';

@Module({
    imports: [RidepriceModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

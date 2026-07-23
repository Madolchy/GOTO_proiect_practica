import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RidepriceModule } from './rideprice/rideprice.module';
import { RidepriceGrpcModule } from './rideprice/grpc/rideprice-grpc.module';

@Module({
    imports: [RidepriceModule, RidepriceGrpcModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

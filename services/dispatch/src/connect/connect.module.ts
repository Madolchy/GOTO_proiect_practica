import { Module } from '@nestjs/common';
import { DriverPositionsModule } from '../driver-positions/driver-positions.module';
import { ConnectRouterService } from './connect-router.service';
import { ConnectMiddleware } from './connect.middleware';

@Module({
    imports: [DriverPositionsModule],
    providers: [ConnectRouterService, ConnectMiddleware],
    exports: [ConnectRouterService, ConnectMiddleware],
})
export class ConnectModule {}

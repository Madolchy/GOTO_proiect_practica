
import { Module } from '@nestjs/common';
import { DispatchCronService } from './dispatchCron.service';
import { DispatchService } from 'src/dispatch/dispatch.service';
import { DispatchModule } from 'src/dispatch/dispatch.module';

import { DispatchWSModule } from 'src/dispatchws/dispatchws.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';


@Module({
    imports: [DispatchModule, DispatchWSModule, RabbitModule],
    providers: [DispatchCronService],
})
export class DispatchCronModule {}

import { Global, Module } from '@nestjs/common';
import { DriversRepository } from './drivers.repository';
import { DrizzleService } from './drizzle.service';
import { RidesRepository } from './rides.repository';

@Global()
@Module({
    providers: [DrizzleService, DriversRepository, RidesRepository],
    exports: [DrizzleService, DriversRepository, RidesRepository],
})
export class DrizzleModule {}

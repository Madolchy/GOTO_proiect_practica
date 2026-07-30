import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
    providers: [DrizzleService],
    exports: [DrizzleService],
})
export class RedisModule {}

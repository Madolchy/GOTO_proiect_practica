import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type RedisClientType } from 'redis';

@Injectable()
export class RedisClient {
    readonly client: RedisClientType;
    // node-redis locks a client out of normal commands once it subscribes,
    // so a duplicate is dedicated to SUBSCRIBE/PMESSAGE only.
    readonly subscriber: RedisClientType;

    constructor(config: ConfigService) {
        this.client = createClient({ url: config.getOrThrow('REDIS_URL') });
        this.subscriber = this.client.duplicate();
    }
}

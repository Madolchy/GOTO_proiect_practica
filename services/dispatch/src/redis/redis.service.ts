import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type RedisClientType} from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    readonly client: RedisClientType;
    // node-redis locks a client out of normal commands once it subscribes,
    // so a duplicate is dedicated to SUBSCRIBE/PMESSAGE only.
    readonly subscriber: RedisClientType;

    constructor(config: ConfigService) {
        this.client = createClient({
            url: config.getOrThrow('REDIS_URL'),
        });
        this.subscriber = this.client.duplicate();
    }

    async onModuleInit(): Promise<void> {
        this.client.on('error', (err) => this.logger.error(`redis client error: ${err.message}`));
        this.subscriber.on('error', (err) => this.logger.error(`redis subscriber error: ${err.message}`));
        await this.client.connect();
        await this.subscriber.connect();
        this.logger.log('connected');
    }

    async onModuleDestroy(): Promise<void> {
        await this.subscriber.quit();
        await this.client.quit();
    }
}

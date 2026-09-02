import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { RedisClient } from './redis.client';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    readonly client: RedisClientType;
    readonly subscriber: RedisClientType;

    constructor(private readonly redisClient: RedisClient) {
        this.client = redisClient.client;
        this.subscriber = redisClient.subscriber;
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

    async onKeyExpired(callback: (key: string) => void | Promise<void>): Promise<void> {
        await this.subscriber.pSubscribe('__keyevent@*__:expired', async (key) => {
            await callback(key);
        });
    }
}

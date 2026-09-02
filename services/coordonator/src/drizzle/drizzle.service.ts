import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EmptyRelations } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { NodePgTransaction } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export type CoordinatorTransaction = NodePgTransaction<EmptyRelations>;

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(DrizzleService.name);
    private _db: NodePgDatabase & { $client: Pool };

    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        const url: string = this.configService.getOrThrow('COORDINATOR_DATABASE_URL');
        this._db = drizzle(url);
        this.logger.log('Database connected');
    }

    async onModuleDestroy() {
        await this._db.$client.end();
    }

    get db() {
        return this._db;
    }
}

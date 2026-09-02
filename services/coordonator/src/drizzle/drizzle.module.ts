import { Global, Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';
import { OutboxRepository } from './outbox.repository';
import { UsersRepository } from './users.repository';

@Global()
@Module({
    providers: [DrizzleService, OutboxRepository, UsersRepository],
    exports: [DrizzleService, OutboxRepository, UsersRepository],
})
export class DrizzleModule {}

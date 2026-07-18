import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DispatchersController } from './dispatchers/dispatchers.controller';

@Module({
  imports: [],
  controllers: [AppController, DispatchersController],
  providers: [AppService],
})
export class AppModule {}

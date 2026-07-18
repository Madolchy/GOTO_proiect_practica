import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ConnectRPC adapter will be mounted here once services are defined, e.g.:
  //   import { connectNodeAdapter } from '@connectrpc/connect-node';
  //   app.use('/api', connectNodeAdapter({ routes: (router) => { ... } }));

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();

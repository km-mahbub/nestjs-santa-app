import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as path from 'path';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const PORT = process.env.SERVER_PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const logger = new Logger('Main');
  app.setGlobalPrefix('api');
  app.useStaticAssets({
    root: path.join(__dirname, '..', 'public'),
    prefix: '/',
  });
  await app.listen(PORT, '0.0.0.0', (err, addr) => {
    logger.log(`Listening at ${addr}`);
  });
}
bootstrap();

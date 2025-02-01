import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import * as process from 'node:process';

async function bootstrap() {
  const logger = new Logger();
  console.log(process.env.STAGE);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = 3000;
  await app.listen(process.env.PORT ?? port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();

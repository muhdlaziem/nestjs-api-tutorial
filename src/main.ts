import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //exclude extra fields in dto
    }),
  ); // for validation: class-validator, class-transformer
  await app.listen(8080);
}
bootstrap();

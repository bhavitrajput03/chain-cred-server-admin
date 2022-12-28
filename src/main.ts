import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerDocument } from './config/swagger.config';
import * as basicAuth from 'express-basic-auth';
import { HttpExceptionFilter } from './shared/filter/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(
    ['/swagger', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  SwaggerModule.setup('swagger', app, swaggerDocument(app));
  //app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();

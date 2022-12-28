import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
  OpenAPIObject,
} from '@nestjs/swagger';

const swagger_config = new DocumentBuilder()
  .setTitle('ChainCred')
  .setDescription('The chaincred API description')
  .setVersion('1.0')
  .addTag('chaincred')
  .addBearerAuth()
  .build();

export default swagger_config;

export class SwaggerOption implements SwaggerDocumentOptions {
  ignoreGlobalPrefix?: boolean = false;
}

export function swaggerDocument(app: INestApplication): OpenAPIObject {
  return SwaggerModule.createDocument(app, swagger_config, new SwaggerOption());
}

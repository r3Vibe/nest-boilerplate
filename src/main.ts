import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Get ConfigService from the application context
  const configService = app.get(ConfigService);
  const env = configService.get<string>('NODE_ENV');
  const port = configService.get<number>('port');

  // set url to /api
  app.setGlobalPrefix('api');

  // allow cross origin
  app.enableCors({
    origin:
      env === 'development'
        ? ['http://localhost:3000', 'http://127.0.0.1:3000']
        : ['https://mydomain.com'],
  });

  // enable gzip to compress response
  app.use(compression());

  // enable cookies
  app.use(cookieParser());

  // enable helmet for security
  app.use(helmet());

  // setup versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  // setup swagger docs only for development
  if (env === 'development') {
    const configInfo = configService.get<{
      name: string;
      description: string;
      version: string;
    }>('project');
    const config = new DocumentBuilder()
      .addBearerAuth()
      .addCookieAuth('access_token')
      .setTitle(configInfo.name)
      .setDescription(configInfo.description)
      .setVersion(configInfo.version)
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);
  }

  // start server

  await app.listen(port);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLoggerService } from './common/custom-logger/custom-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // use custom logger
  const logger = app.get(CustomLoggerService);
  app.useLogger(logger);

  // get configurastion
  const configService = app.get(ConfigService);

  // enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  // add a uri prefix
  app.setGlobalPrefix('api');

  // enable cookies
  app.use(cookieParser());

  // enable compression
  app.use(compression());

  // enable helmet
  app.use(helmet());

  const env = configService.get('general').nodeEnv;

  // enable cors
  app.enableCors({
    origin:
      env === 'development'
        ? ['http://localhost:3000', 'http://127.0.0.1:3000']
        : ['https://mydomain.com'],
  });

  // setup swagger docs only for development
  if (env === 'development') {
    const configInfo = configService.get<{
      projectName: string;
      projectDesc: string;
      projectVersion: string;
    }>('swagger');
    const config = new DocumentBuilder()
      .addBearerAuth()
      .addCookieAuth('access_token')
      .setTitle(configInfo.projectName)
      .setDescription(configInfo.projectDesc)
      .setVersion(configInfo.projectVersion)
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(configService.get('general').port);

  logger.log(
    `Application is running on: ${await app.getUrl()} in ${env} mode`,
    'CustomLogger',
  );

  logger.log(
    `API Docs Available on: ${await app.getUrl()}/docs in ${env} mode`,
    'CustomLogger',
  );
}
bootstrap();

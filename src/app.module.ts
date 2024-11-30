import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import configuration from './config/configuration';
import { envSchema } from './common/validation/env.validation';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  I18nService,
  QueryResolver,
} from 'nestjs-i18n';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<{ secret: string }>('jwt')?.secret,
        signOptions: {
          algorithm: config.get<{ algorithm: string }>('jwt')?.algorithm as any,
          issuer: config.get<{ issuer: string }>('jwt')?.issuer,
        },
        verifyOptions: {
          algorithms: [
            config.get<{ algorithm: string }>('jwt')?.algorithm as any,
          ],
          issuer: config.get<{ issuer: string }>('jwt')?.issuer,
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.getOrThrow('database').type,
        host: configService.getOrThrow('database').host,
        port: configService.getOrThrow('database').port,
        username: configService.getOrThrow('database').username,
        password: configService.getOrThrow('database').password,
        database: configService.getOrThrow('database').name,
        autoLoadEntities: true,
        synchronize:
          configService.getOrThrow('NODE_ENV') === 'production' ? false : true,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService, I18nService],
      useFactory: (configService: ConfigService, i18n: I18nService) => ({
        transport: {
          host: configService.getOrThrow('email').smtpHost,
          port: configService.getOrThrow('email').smtpPort,
          auth: {
            user: configService.getOrThrow('email').smtpUser,
            pass: configService.getOrThrow('email').smtpPassword,
          },
        },
        defaults: {
          from: `${configService.getOrThrow('email').smtpFromName} <${configService.getOrThrow('email').smtpFromEmail}>`,
        },
        template: {
          dir:
            configService.getOrThrow('general').nodeEnv === 'production'
              ? join(__dirname, 'email_templates')
              : resolve(__dirname, '../src/email_templates'),
          adapter: new HandlebarsAdapter({ t: i18n.hbsHelper }),
          options: {
            strict: true,
          },
        },
      }),
    }),
    I18nModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('i18n').fallbackLanguage,
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
        typesOutputPath:
          configService.getOrThrow('general').nodeEnv === 'production'
            ? join(__dirname, '/i18n/i18n-types.ts')
            : resolve(__dirname, '../src/i18n/i18n-types.ts'),
        viewEngine: 'hbs',
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 3,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envSchema,
    }),
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { envSchema } from './common/validation/env.validation';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  I18nService,
  QueryResolver,
} from 'nestjs-i18n';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { OTP } from './auth/entities/otp.entity';
import { Session } from './auth/entities/session.entity';
import { MagicLink } from './auth/entities/magic-link.entity';
import { Token } from './auth/entities/token.entity';
import { AuthFlow } from './auth/entities/flow.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService, i18n: I18nService) => ({
        transport: {
          host: configService.getOrThrow('SMTP_HOST'),
          port: configService.getOrThrow('SMTP_PORT'),
          auth: {
            user: configService.getOrThrow('SMTP_USER'),
            pass: configService.getOrThrow('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `${configService.getOrThrow('SMTP_FROM_NAME')} <${configService.getOrThrow('SMTP_FROM_EMAIL')}>`,
        },
        template: {
          dir: join(__dirname, 'emails'),
          adapter: new HandlebarsAdapter({ t: i18n.hbsHelper }),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService, I18nService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.getOrThrow('MONGODB_URI'),
        entities: [User, OTP, Session, MagicLink, Token, AuthFlow],
        synchronize:
          configService.getOrThrow('NODE_ENV') === 'production' ? false : true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: envSchema,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('FALLBACK_LANGUAGE'),
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
        typesOutputPath: join(__dirname, '/generated/i18n.generated.ts'),
        viewEngine: 'hbs',
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 3,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)'],
    }),
    UsersModule,
    AuthModule,
    CommonModule,
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

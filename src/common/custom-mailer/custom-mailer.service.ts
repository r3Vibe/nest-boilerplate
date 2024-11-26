import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../custom-logger/custom-logger.service';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class CustomMailerService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: CustomLoggerService,
    private readonly i18n: I18nService,
  ) {}
  async sendMails(
    to: string,
    subject: string,
    template: string,
    context: object,
  ) {
    this.mailerService
      .sendMail({
        to,
        subject,
        template,
        context: {
          ...context,
          i18nLang: I18nContext.current().lang,
        },
      })
      .then(() => {
        this.logger.log(
          this.i18n.t('common.success_mail'),
          'CustomMailerService',
        );
      })
      .catch(() => {
        this.logger.error(
          this.i18n.t('common.error_mail'),
          'CustomMailerService',
        );
      });
  }
}

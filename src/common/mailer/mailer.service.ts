import { Injectable } from '@nestjs/common';
import { MailerService as Mailer } from '@nestjs-modules/mailer';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CustomLoggerService } from 'src/common/custom-logger/custom-logger.service';

@Injectable()
export class MailerService {
  constructor(
    private readonly mailerService: Mailer,
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
        this.logger.log(this.i18n.t('test.success_mail'));
      })
      .catch(() => {
        this.logger.error(this.i18n.t('test.error_mail'));
      });
  }
}

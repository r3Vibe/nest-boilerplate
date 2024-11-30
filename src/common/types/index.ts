import { PathImpl2 } from '@nestjs/config';
import { I18nTranslations } from 'src/i18n/i18n-types';

export type CustomJoiValidationError = {
  message: PathImpl2<I18nTranslations>;
  metadata: {
    label: string;
    type: string;
  };
};

export type ResponseObj = {
  success: boolean;
  timestamp: string;
  message: string | object;
};

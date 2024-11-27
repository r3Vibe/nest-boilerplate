export default () => ({
  general: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  swagger: {
    projectName: process.env.PROJECT_NAME || 'Boilerplate',
    projectDesc: process.env.PROJECT_DESC || 'Nest JS Boilerplate',
    projectVersion: process.env.PROJECT_VER || '2.0.0',
  },
  socialLogin: {
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    issuer: process.env.JWT_ISS || 'bp',
    accessExpiryHours: parseInt(process.env.JWT_ACCESS_EXPIRY_HOURS, 10) || 3,
    refreshExpiryDays: parseInt(process.env.JWT_REFRESH_EXPIRY_DAYS, 10) || 3,
    algorithm: process.env.JWT_ALGO || 'HS256',
  },
  i18n: {
    fallbackLanguage: process.env.FALLBACK_LANGUAGE || 'en',
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nestbp',
    type: process.env.DB_TYPE || 'mongodb',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'bp',
  },
  auth: {
    verifyEmailAfterRegistration:
      process.env.VERIFY_EMAIL_AFTER_REGISTRATION === 'true',
    needOtpAfterLogin: process.env.NEED_OTP_AFTER_LOGIN === 'true',
    otpExpiryMinutes:
      parseInt(process.env.VERIFICATION_OTP_EXPIRY_MINUTES, 10) || 15,
    otpDelivery: process.env.OTP_DELIVERY || 'email',
  },
  email: {
    smtpHost: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    smtpPort: parseInt(process.env.SMTP_PORT, 10) || 2525,
    smtpUser: process.env.SMTP_USER || '',
    smtpPassword: process.env.SMTP_PASSWORD || '',
    smtpFromName: process.env.SMTP_FROM_NAME || 'Boilerplate 2.0',
    smtpFromEmail: process.env.SMTP_FROM_EMAIL || 'bp@example.com',
    secure: process.env.SMTP_SECURE === 'true',
  },
});

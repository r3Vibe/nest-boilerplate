// setup global configuration
export default () => ({
  port: parseInt(process.env.PORT, 10),
  NODE_ENV: process.env.NODE_ENV,
  project: {
    name: process.env.PROJECT_NAME,
    description: process.env.PROJECT_DESC,
    version: process.env.PROJECT_VER,
  },
  social: {
    google: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      callback: process.env.GOOGLE_CALLBACK_URL,
    },
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISS,
    accres_expiry: process.env.JWT_ACCESS_EXPIRY_HOURS,
    refres_expiry: process.env.JWT_REFRESH_EXPIRY_DAYS,
    algo: process.env.JWT_ALGO,
  },
  fallbackLanguage: process.env.FALLBACK_LANGUAGE,
});

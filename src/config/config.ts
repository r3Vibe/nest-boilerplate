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
});

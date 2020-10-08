export const constants = {
  PORT: process.env.PORT || 3000,
  HOST_URL: process.env.HOST_URL || "http://localhost:3000",
  ADMIN_UI_URL: process.env.ADMIN_UI_URL || "http://localhost:8080",
  IS_PROD: process.env.NODE_ENV == "production" ? true : false
};

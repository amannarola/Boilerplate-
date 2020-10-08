export const constants = {
  PROVIDER: process.env.GOOGLE_PROVIDER,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
  SCOPE: ['email', 'profile'],
  FAILURE_REDIRECT: '/'
};

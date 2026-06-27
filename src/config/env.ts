import { z } from 'zod';

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1, 'Google Client ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'Google Client Secret is required'),
  GOOGLE_API_KEY: z.string().min(1, 'Google API Key is required'),
  AUTH_URL: z.string().url('Invalid AUTH_URL'),
  AUTH_SECRET: z.string().min(1, 'Auth Secret is required'),
  MONGODB_URI: z.string().url('Invalid MongoDB URI'),
  DATABASE_NAME: z.string().default('DriveGallery'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

const _env = envSchema.safeParse({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  AUTH_URL: process.env.AUTH_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  NODE_ENV: process.env.NODE_ENV,
});

if (!_env.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    _env.error.format()
  );
  throw new Error('Invalid environment variables');
}

export const env = _env.data;

import { z } from 'zod';

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().min(1),
  API_KEY: z.string().min(1),
  API_URL: z.string().url(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
});

export const env = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
  },
  api: {
    key: process.env.API_KEY!,
    url: process.env.API_URL!,
  },
} as const;

if (process.env.NODE_ENV !== 'production') {
  serverSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    API_KEY: process.env.API_KEY,
    API_URL: process.env.API_URL,
  });
  
  clientSchema.parse({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });
}
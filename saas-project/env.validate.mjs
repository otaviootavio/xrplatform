// env.validate.mjs
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida'),
    CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY é obrigatória'),
    API_KEY: z.string().min(1, 'API_KEY é obrigatória'),
    API_URL: z.string().url('API_URL deve ser uma URL válida'),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY é obrigatória'),
  },
  runtimeEnv: process.env,
});
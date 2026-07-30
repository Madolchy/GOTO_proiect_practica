import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { resolve } from 'node:path';

config({ path: resolve(__dirname, '../../.env') });

export default defineConfig({
  out: './drizzle',
  schema: './src/drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL!,
  },
});

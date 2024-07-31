import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: "localhost",
    user: "postgres",
    password: "password",
    database: "nest",
    port: parseInt("5432"),
    ssl: false,
  },
} satisfies Config;
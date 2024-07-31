import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DB',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log('ConfigService', configService);
        const pool = new Pool({
          host: "localhost",
          user: "postgres",
          password: "password",
          database: "nest",
          port: 5432,
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: ['DB'],
})
export class DrizzleModule {}
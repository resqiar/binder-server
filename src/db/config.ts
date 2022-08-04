import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const dbConfig: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  entities: ['dist/**/*.entity{.ts,.js}'],

  // synchronization should set to false when it comes to production
  synchronize: true,
};

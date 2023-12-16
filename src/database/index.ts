import { DataSource } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.NODE_ENV === 'test' ? ':memory:' : 'database/db.sqlite',
  entities: ['src/models/*.ts'],
  logging: true,
  synchronize: true,
});

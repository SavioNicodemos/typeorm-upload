import { DataSource } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'sqlite',
  database:
    process.env.NODE_ENV === 'test'
      ? 'database/test.sqlite'
      : 'database/db.sqlite',
  entities: ['src/models/*.ts'],
  logging: false,
  synchronize: true,
});

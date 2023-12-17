import 'dotenv/config';
import 'reflect-metadata';

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import cors from 'cors';
import AppError from './errors/AppError';
import routes from './routes';

import { appDataSource } from './database';

if (process.env.NODE_ENV !== 'test') {
  appDataSource
    .initialize()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('Data Source has been initialized!');
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error('Error during Data Source initialization:', err);
    });
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export default app;

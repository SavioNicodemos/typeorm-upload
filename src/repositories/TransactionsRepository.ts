import { appDataSource } from '../database';
import Transaction from '../models/Transaction';

type Balance = {
  income: number;
  outcome: number;
  total: number;
};

export const transactionsRepository = appDataSource
  .getRepository(Transaction)
  .extend({
    async getBalance(): Promise<Balance> {
      const transactions = await this.find();

      const { income, outcome } = transactions.reduce(
        (accumulator, transaction) => {
          switch (transaction.type) {
            case 'income':
              accumulator.income += Number(transaction.value);
              break;

            case 'outcome':
              accumulator.outcome += Number(transaction.value);
              break;

            default:
              break;
          }

          return accumulator;
        },
        {
          income: 0,
          outcome: 0,
          total: 0,
        },
      );

      const total = income - outcome;

      return { income, outcome, total };
    },
  });

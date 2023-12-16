import Category from '../models/Category';

import AppError from '../errors/AppError';

import { appDataSource } from '../database';
import Transaction from '../models/Transaction';
import { transactionsRepository } from '../repositories/TransactionsRepository';

type Request = {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
};

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = appDataSource.getRepository(Category);

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();

      if (total < value) {
        throw new AppError('Invalid balance for this operation');
      }
    }

    const hasCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!hasCategory) {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);
    }

    const getCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: getCategory ?? undefined,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

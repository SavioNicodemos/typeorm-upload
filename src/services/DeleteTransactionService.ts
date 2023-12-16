import AppError from '../errors/AppError';

import { transactionsRepository } from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const hasTransaction = await transactionsRepository.findOne({
      where: { id },
    });

    if (!hasTransaction) {
      throw new AppError('Transaction does not exist');
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;

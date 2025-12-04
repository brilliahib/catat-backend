import { TransactionEntity } from '../entities/transaction.entity';

export interface TransactionPerDay {
  date: string;
  total: number;
  transactions: TransactionEntity[];
}

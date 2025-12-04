import { TransactionEntity } from '../entities/transaction.entity';

export interface TransactionGroup {
  date: string;
  total: number;
  transactions: TransactionEntity[];
}

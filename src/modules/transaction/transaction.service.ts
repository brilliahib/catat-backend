import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionGroup } from './interface/transaction.interface';
import { Transaction } from 'generated/prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}
  private groupTransactions(
    results: Transaction[],
    formatter: (date: Date) => string,
  ): TransactionGroup[] {
    const grouped: Record<string, TransactionGroup> = {};

    for (const item of results) {
      const key = formatter(item.date);

      if (!grouped[key]) {
        grouped[key] = {
          date: key,
          total: 0,
          transactions: [],
        };
      }

      const entity = new TransactionEntity(item);

      grouped[key].transactions.push(entity);
      grouped[key].total += entity.amount;
    }

    return Object.values(grouped);
  }

  async create(dto: CreateTransactionDto, userId: number) {
    const result = await this.prisma.transaction.create({
      data: {
        user_id: userId,
        amount: dto.amount,
        type: dto.type,
        notes: dto.notes,
        date: dto.date,
      },
    });

    return new TransactionEntity(result);
  }

  async findByUserId(userId: number) {
    const results = await this.prisma.transaction.findMany({
      where: {
        user_id: userId,
      },
    });

    if (results.length === 0) {
      throw new NotFoundException('No transactions found for this user');
    }

    if (!results.every((item) => item.user_id === userId)) {
      throw new ForbiddenException(
        'You do not have access to some of the transactions',
      );
    }

    return results.map((item) => new TransactionEntity(item));
  }

  async findOne(id: number, userId: number) {
    const result = await this.prisma.transaction.findFirst({
      where: {
        id: id,
        user_id: userId,
      },
    });

    if (userId !== result?.user_id) {
      throw new ForbiddenException(
        'You do not have access to this transaction',
      );
    }

    if (!result) {
      throw new NotFoundException('Transaction not found');
    }

    return new TransactionEntity(result);
  }

  async update(id: number, dto: UpdateTransactionDto, userId: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.user_id !== userId) {
      throw new ForbiddenException(
        'You do not have access to update this transaction',
      );
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        amount: dto.amount,
        type: dto.type,
        notes: dto.notes,
        date: dto.date,
      },
    });

    return new TransactionEntity(updatedTransaction);
  }

  async delete(id: number, userId: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.user_id !== userId) {
      throw new ForbiddenException(
        'You do not have access to delete this transaction',
      );
    }

    await this.prisma.transaction.delete({
      where: { id },
    });
  }

  async findByUserIdPerDay(userId: number): Promise<TransactionGroup[]> {
    const results = await this.prisma.transaction.findMany({
      where: { user_id: userId },
      orderBy: { date: 'desc' },
    });

    if (results.length === 0) {
      throw new NotFoundException('No transactions found for this user');
    }

    if (!results.every((item) => item.user_id === userId)) {
      throw new ForbiddenException(
        'You do not have access to some of the transactions',
      );
    }

    return this.groupTransactions(results, (date: Date) => {
      return date.toISOString().split('T')[0];
    });
  }

  async findByUserIdPerMonth(userId: number): Promise<TransactionGroup[]> {
    const results = await this.prisma.transaction.findMany({
      where: { user_id: userId },
      orderBy: { date: 'desc' },
    });

    if (results.length === 0) {
      throw new NotFoundException('No transactions found for this user');
    }

    if (!results.every((item) => item.user_id === userId)) {
      throw new ForbiddenException(
        'You do not have access to some of the transactions',
      );
    }

    return this.groupTransactions(results, (date: Date) => {
      const [year, month] = date.toISOString().split('T')[0].split('-');
      return `${year}-${month}`;
    });
  }

  async findByUserIdPerYear(userId: number): Promise<TransactionGroup[]> {
    const results = await this.prisma.transaction.findMany({
      where: { user_id: userId },
      orderBy: { date: 'desc' },
    });

    if (results.length === 0) {
      throw new NotFoundException('No transactions found for this user');
    }

    if (!results.every((item) => item.user_id === userId)) {
      throw new ForbiddenException(
        'You do not have access to some of the transactions',
      );
    }

    return this.groupTransactions(results, (date: Date) => {
      return String(date.getFullYear());
    });
  }
}

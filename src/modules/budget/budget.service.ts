import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  private getDateRange(type: 'DAY' | 'WEEK' | 'MONTH'): {
    start: Date;
    end: Date;
  } {
    const now = new Date();
    let start: Date;
    let end: Date = new Date();

    if (type === 'DAY') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (type === 'WEEK') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      start = new Date(now.setDate(diff));
    } else {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return { start, end };
  }

  async create(dto: CreateBudgetDto, userId: number) {
    const existingBudget = await this.prisma.budget.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (existingBudget) {
      throw new ForbiddenException('Budget already exists for this user');
    }

    const result = await this.prisma.budget.create({
      data: {
        user_id: userId,
        amount: dto.amount,
        type: dto.type,
      },
    });

    return result;
  }

  async getRemainingBudget(userId: number) {
    const budget = await this.prisma.budget.findFirst({
      where: { user_id: userId },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found for this user');
    }

    if (budget.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this budget');
    }

    const { start, end } = this.getDateRange(budget.type);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        user_id: userId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const used = transactions.reduce((sum, t) => sum + t.amount, 0);
    const remaining = budget.amount - used;
    const percentage = remaining / budget.amount;

    const status = percentage <= 0.2 ? 'warning' : 'safe';

    return {
      type: budget.type,
      budget: budget.amount,
      used,
      remaining: remaining < 0 ? 0 : remaining,
      percentage,
      status,
    };
  }

  async update(dto: UpdateBudgetDto, userId: number) {
    const budget = await this.prisma.budget.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    if (budget.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this budget');
    }

    const result = await this.prisma.budget.update({
      where: { user_id: userId },
      data: {
        ...dto,
      },
    });

    return result;
  }

  async delete(userId: number) {
    const budget = await this.prisma.budget.findUnique({
      where: { user_id: userId },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    if (budget.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this budget');
    }

    await this.prisma.budget.delete({
      where: { user_id: userId },
    });
  }
}

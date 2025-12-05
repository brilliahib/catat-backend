import { ApiProperty } from '@nestjs/swagger';
import { BudgetType } from 'generated/prisma';

export class BudgetEntity {
  @ApiProperty({ example: 1, description: 'Unique identifier for the budget' })
  id: number;

  @ApiProperty({
    example: 5000,
    description: 'Amount allocated for the budget',
  })
  amount: number;

  @ApiProperty({
    example: 'MONTH',
    description: 'Type of the budget (e.g., DAY, WEEK, MONTH)',
    enum: BudgetType,
  })
  type: BudgetType;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<BudgetEntity>) {
    Object.assign(this, partial);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { BudgetType } from 'generated/prisma/enums';

export class CreateBudgetDto {
  @ApiProperty({
    description: 'Amount allocated for the budget',
    example: 5000,
  })
  amount: number;

  @ApiProperty({
    description: 'Type of the budget (e.g., DAY, WEEK, MONTH)',
    example: 'MONTH',
    enum: BudgetType,
  })
  type: BudgetType;
}

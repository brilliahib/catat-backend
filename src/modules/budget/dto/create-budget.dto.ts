import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { BudgetType } from 'generated/prisma';

export class CreateBudgetDto {
  @ApiProperty({
    description: 'Amount allocated for the budget',
    example: 5000,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Type of the budget (e.g., DAY, WEEK, MONTH)',
    example: 'MONTH',
    enum: BudgetType,
  })
  @IsEnum(BudgetType)
  type: BudgetType;
}

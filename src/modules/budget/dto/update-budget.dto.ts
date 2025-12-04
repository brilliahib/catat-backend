import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBudgetDto } from './create-budget.dto';
import { IsOptional } from 'class-validator';
import { BudgetType } from 'generated/prisma';

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {
  @ApiProperty({
    description: 'Amount allocated for the budget',
    example: 5000,
    required: false,
  })
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Type of the budget',
    example: 'MONTH',
    required: false,
    enum: BudgetType,
  })
  @IsOptional()
  type?: BudgetType;
}

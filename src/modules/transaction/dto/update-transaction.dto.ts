import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsOptional } from 'class-validator';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @ApiProperty({
    description: 'Amount of the transaction',
    example: 1500,
    required: false,
  })
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Type of the transaction',
    example: 'Eating',
    required: false,
  })
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'Additional notes for the transaction',
    example: 'Lunch with friends',
    nullable: true,
    required: false,
  })
  @IsOptional()
  notes?: string | null;

  @ApiProperty({
    description: 'Date of the transaction',
    example: '2024-04-27T12:00:00Z',
    required: false,
  })
  @IsOptional()
  date?: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Amount of the transaction',
    example: 1500,
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'Type of the transaction (e.g., Eating, Transport, Salary)',
    example: 'Eating',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Additional notes for the transaction',
    example: 'Lunch with friends',
    nullable: true,
  })
  @IsString()
  notes?: string | null;

  @ApiProperty({
    description: 'Date of the transaction',
    example: '2024-04-27T12:00:00Z',
  })
  @IsDate()
  date: Date;
}

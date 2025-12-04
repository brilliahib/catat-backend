import { ApiProperty } from '@nestjs/swagger';

export class TransactionEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  type: string;

  @ApiProperty({ nullable: true })
  notes?: string | null;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<TransactionEntity>) {
    Object.assign(this, partial);
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class AuthEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone_number: string;

  constructor(partial: Partial<AuthEntity>) {
    Object.assign(this, partial);
  }
}

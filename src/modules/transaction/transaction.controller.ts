import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/interfaces/request.interface';

@Controller('transaction')
@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const data = await this.transactionService.create(
      createTransactionDto,
      userId,
    );

    return {
      data: data,
      message: 'Transaction created successfully',
    };
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.transactionService.findByUserId(userId);
    return {
      data: data,
      message: 'Transactions retrieved successfully',
    };
  }

  @Get('per-day')
  async getTransactionsPerDay(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.transactionService.findByUserIdPerDay(userId);
    return {
      data: data,
      message: 'Transactions per day retrieved successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.transactionService.findOne(id, userId);
    return {
      data: data,
      message: 'Transaction retrieved successfully',
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const data = await this.transactionService.update(
      +id,
      updateTransactionDto,
      userId,
    );
    return {
      data: data,
      message: 'Transaction updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    await this.transactionService.delete(id, userId);
    return {
      message: 'Transaction deleted successfully',
    };
  }
}

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
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/common/interfaces/request.interface';

@Controller('budget')
@ApiTags('Budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async create(
    @Body() createBudgetDto: CreateBudgetDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const data = await this.budgetService.create(createBudgetDto, userId);

    return {
      data: data,
      message: 'Budget created successfully',
    };
  }

  @Get('remaining')
  async getRemainingBudget(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.budgetService.getRemainingBudget(userId);
    return {
      data: data,
      message: 'Remaining budget retrieved successfully',
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const data = await this.budgetService.update(+id, updateBudgetDto, userId);
    return {
      data: data,
      message: 'Budget updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.budgetService.delete(+id, userId);
    return {
      data: data,
      message: 'Budget deleted successfully',
    };
  }
}

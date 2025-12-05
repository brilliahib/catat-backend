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
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/common/interfaces/request.interface';
import { BudgetEntity } from './entities/budget.entity';

@Controller('budgets')
@ApiTags('Budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @ApiCreatedResponse({
    description: 'Budget created successfully',
    type: BudgetEntity,
  })
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

  @Patch()
  async update(
    @Body() updateBudgetDto: UpdateBudgetDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const data = await this.budgetService.update(updateBudgetDto, userId);
    return {
      data: data,
      message: 'Budget updated successfully',
    };
  }

  @Delete()
  async remove(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const data = await this.budgetService.delete(userId);
    return {
      data: data,
      message: 'Budget deleted successfully',
    };
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { BudgetModule } from './modules/budget/budget.module';

@Module({
  imports: [AuthModule, TransactionModule, BudgetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

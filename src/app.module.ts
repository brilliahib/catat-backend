import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [AuthModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

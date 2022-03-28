import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/utils/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}

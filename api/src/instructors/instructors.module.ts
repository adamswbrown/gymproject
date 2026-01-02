import { Module } from '@nestjs/common';
import { InstructorsController } from './instructors.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InstructorsController],
})
export class InstructorsModule {}



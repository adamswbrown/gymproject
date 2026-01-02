import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}



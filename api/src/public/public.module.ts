import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { ClassesModule } from '../classes/classes.module';

@Module({
  imports: [ClassesModule],
  controllers: [PublicController],
})
export class PublicModule {}



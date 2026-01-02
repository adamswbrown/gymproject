import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { ClassesService } from '../classes/classes.service';
import { ScheduleQueryDto } from './dto/schedule-query.dto';
import { ScheduleResponseDto } from './dto/schedule-response.dto';

@Controller('public')
export class PublicController {
  constructor(private readonly classesService: ClassesService) {}

  @Public()
  @Get('schedule')
  async getSchedule(
    @Query() query: ScheduleQueryDto,
  ): Promise<{ ok: true; data: ScheduleResponseDto[] }> {
    const schedule = await this.classesService.getPublicSchedule(query);
    return { ok: true, data: schedule };
  }
}



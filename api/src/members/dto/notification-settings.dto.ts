import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateNotificationSettingsDto {
  @IsOptional()
  @IsBoolean()
  receiptsEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  waitlistEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  classNotificationsEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  courseNotificationsEmail?: boolean;
}


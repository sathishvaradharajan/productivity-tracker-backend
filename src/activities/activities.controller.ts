import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('/start/:userId')
  startActivity(@Param('userId') userId: number) {
    return this.activitiesService.startActivity(userId);
  }

  @Post('/end')
  endActivity(@Body() body: { activityId: number }) {
    return this.activitiesService.endActivity(body.activityId);
  }
}

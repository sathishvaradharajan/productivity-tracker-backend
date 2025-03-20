import { Controller, Post, Body, Param } from '@nestjs/common';
import { ActivitiesService } from './activities.service';

@Controller('activities')
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

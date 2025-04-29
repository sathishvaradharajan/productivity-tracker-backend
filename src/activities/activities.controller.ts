import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('activities')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
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

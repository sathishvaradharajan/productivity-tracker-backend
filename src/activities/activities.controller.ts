import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('/start')
  startActivity(@Request() req: any) {
    const userId = req.user.userId;
    console.log('User ID:', userId);
    return this.activitiesService.startActivity(userId);
  }

  @Post('/end')
  endActivity(@Request() req: any, @Body() body: { activityId: number }) {
    const userId = req.user.userId;
    return this.activitiesService.endActivity(userId);
  }
}

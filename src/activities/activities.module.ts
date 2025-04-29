import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { Activity } from '../entities/activity.entity';
import { User } from '../entities/user.entity';
import { ActivityGateway } from '../activity/activity.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, User])],
  controllers: [ActivitiesController],
  providers: [ActivitiesService,ActivityGateway], 
  exports: [ActivitiesService],
})
export class ActivitiesModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async startActivity(userId: number): Promise<Activity> {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['activities'] });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const activity = this.activitiesRepository.create({
      user,
      startTime: new Date(),
      status: 'active',
    });

    return this.activitiesRepository.save(activity);
  }

  async endActivity(activityId: number): Promise<Activity> {
    const activity = await this.activitiesRepository.findOne({ where: { id: activityId }, relations: ['user'] });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    activity.endTime = new Date();
    activity.status = 'completed';

    return this.activitiesRepository.save(activity);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import { User } from '../entities/user.entity';
import { ActivityGateway } from '../activity/activity.gateway';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly activityGateway: ActivityGateway,
  ) {}

  async startActivity(userId: number): Promise<Activity> {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['activities'] });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Auto-end any active session
    const activeActivity = await this.activitiesRepository.findOne({
      where: { user: { id: userId }, status: 'active' },
    });

    if (activeActivity) {
      activeActivity.endTime = new Date();
      activeActivity.status = 'completed';
      await this.activitiesRepository.save(activeActivity);
      this.activityGateway.notifyActivityEnd(userId);
    }

    const newActivity = this.activitiesRepository.create({
      user,
      startTime: new Date(),
      status: 'active',
    });

    const savedActivity = await this.activitiesRepository.save(newActivity);
    this.activityGateway.notifyActivityStart(user.id);

    return savedActivity;
  }

  async endActivity(userId: number): Promise<Activity> {
    const activeActivity = await this.activitiesRepository.findOne({
      where: { user: { id: userId }, status: 'active' },
      relations: ['user'],
    });

    if (!activeActivity) {
      throw new NotFoundException('No active activity to end');
    }

    activeActivity.endTime = new Date();
    activeActivity.status = 'completed';

    const savedActivity = await this.activitiesRepository.save(activeActivity);
    this.activityGateway.notifyActivityEnd(userId);

    return savedActivity;
  }
}

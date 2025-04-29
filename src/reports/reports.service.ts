import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Activity } from '../entities/activity.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Activity)
    private activityRepo: Repository<Activity>,
  ) {}

  private calculateMinutes(start: Date, end: Date) {
    return Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60));
  }

  async getReport(userId: number, from: Date, to: Date) {
    const activities = await this.activityRepo.find({
      where: {
        user: { id: userId },
        startTime: Between(from, to),
      },
    });

    const dailySummary = new Map<string, number>();

    activities.forEach(activity => {
      if (activity.endTime) {
        const dateKey = new Date(activity.startTime).toISOString().split('T')[0];
        const minutes = this.calculateMinutes(activity.startTime, activity.endTime);
        dailySummary.set(dateKey, (dailySummary.get(dateKey) || 0) + minutes);
      }
    });

    return Array.from(dailySummary.entries()).map(([date, minutes]) => ({
      date,
      totalMinutes: minutes,
      totalHours: (minutes / 60).toFixed(2),
    }));
  }

  async getWeeklyReport(userId: number) {
    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return this.getReport(userId, start, now);
  }

  async getMonthlyReport(userId: number) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.getReport(userId, start, now);
  }

  async getMostProductiveDay(userId: number) {
    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - 30);

    const report = await this.getReport(userId, start, now);

    const maxDay = report.reduce(
      (max, curr) => (curr.totalMinutes > max.totalMinutes ? curr : max),
      { date: '', totalMinutes: 0 },
    );

    return {
      mostProductiveDay: maxDay.date,
      minutes: maxDay.totalMinutes,
      hours: (maxDay.totalMinutes / 60).toFixed(2),
    };
  }
}

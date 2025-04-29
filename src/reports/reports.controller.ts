import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Get today\'s report' })
  getTodayReport(@Req() req) {
    return this.reportsService.getReport(req.user.userId, this.todayStart(), new Date());
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Get this week\'s report' })
  getWeekly(@Req() req) {
    return this.reportsService.getWeeklyReport(req.user.userId);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get this month\'s report' })
  getMonthly(@Req() req) {
    return this.reportsService.getMonthlyReport(req.user.userId);
  }

  @Get('most-productive-day')
  @ApiOperation({ summary: 'Get the most productive day in last 30 days' })
  getMostProductive(@Req() req) {
    return this.reportsService.getMostProductiveDay(req.user.userId);
  }

  private todayStart(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
}

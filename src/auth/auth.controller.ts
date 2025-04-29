import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GithubService } from '../github/github.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private githubService: GithubService,
  ) {}

  @Get('github')
  @ApiOperation({ summary: 'Redirect to GitHub for authentication' })
  @ApiResponse({ status: 200, description: 'Redirect initiated' })
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    // Redirects to GitHub
  }
  
  @Get('github/callback')
  @ApiOperation({ summary: 'GitHub callback with JWT response' })
  @ApiResponse({ status: 200, description: 'Login successful, JWT returned' })
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req) {
    return this.authService.loginWithGitHub(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('github/commits')
  async getUserCommits(@Req() req) {
    const user = req.user;
    return this.githubService.getRecentCommits(user.accessToken);
  }
}

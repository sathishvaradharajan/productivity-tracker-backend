import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import axios from 'axios';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      const email = await this.fetchGitHubEmail(accessToken);

      if (!email) {
        throw new Error('GitHub email not found');
      }

      let user = await this.usersService.findByEmail(email);

      if (!user) {
        user = await this.usersService.createUser(profile.username, email);
      }

      done(null, { id: user.id, username: user.username });
    } catch (err) {
      console.error('Error in validate()', err);
      done(err, false);
    }
  }

  async fetchGitHubEmail(accessToken: string): Promise<string | null> {
    try {
      const response = await axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const emailData = response.data.find((email: any) => email.primary);
      return emailData ? emailData.email : null;
    } catch (err) {
      console.error('Error fetching GitHub email:', err);
      return null;
    }
  }
}

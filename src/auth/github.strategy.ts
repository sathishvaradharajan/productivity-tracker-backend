import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      console.log('GitHub profile:', profile);

      const { id, username } = profile;
  
      const user = {
        githubId: id,
        username,
        accessToken,
      };
  
      done(null, user);
    } catch (err) {
      console.error('Error in validate()', err);
      done(err, false);
    }
  }
  
  
}
// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async loginWithGitHub(user: any) {
  const payload = {
    sub: user.githubId,
    username: user.username,
    accessToken: user.accessToken, // 👈 this is crucial
  };
  return {
    access_token: this.jwtService.sign(payload),
  };
}
}

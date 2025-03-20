import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async createUser(username: string, email: string): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = this.usersRepository.create({ username, email });
    return await this.usersRepository.save(user);
  }
}

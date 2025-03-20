import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Activity } from './activity.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string; 

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Activity, (activity) => activity.user, { cascade: true })
  activities: Activity[];
}

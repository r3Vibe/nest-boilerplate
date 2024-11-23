import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  ObjectIdColumn,
  ObjectId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sessions')
export class Session {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  deviceInfo: string; // Browser, OS, etc.

  @Column()
  ipAddress: string;

  @CreateDateColumn({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
    type: 'timestamp',
    default: () => 'NOW()',
  })
  updatedAt: Date;

  @Column({ default: false })
  isRevoked: boolean;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;
}

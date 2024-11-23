import { Session } from 'src/auth/entities/session.entity';
import {
  Entity,
  Column,
  OneToMany,
  ObjectId,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn({ primary: true })
  _id: ObjectId;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true }) // For OTP-based accounts without a password
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  twoFactorSecret: string; // For storing 2FA secret (if using TOTP)

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ default: true })
  isActive: boolean; // For soft deletion or account deactivation

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

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
}

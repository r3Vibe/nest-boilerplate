import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
  ObjectId,
} from 'typeorm';

@Entity('otps')
export class OTP {
  @ObjectIdColumn()
  _id: ObjectId;

  @ObjectIdColumn()
  flowId: ObjectId;

  @Column()
  code: string; // OTP code

  @Column()
  expiresAt: Date;

  @Column({ default: 0 })
  attempts: number;

  @Column({ default: false })
  isUsed: boolean;

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

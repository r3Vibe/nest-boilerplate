import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
  ObjectId,
} from 'typeorm';

export enum Flow {
  OTP = 'otp',
  MAGIC_LINK = 'magic_link',
  TOKEN = 'token',
  NONE = 'none',
  VALIDATE = 'validate',
}

@Entity('auth_flow')
export class AuthFlow {
  @ObjectIdColumn()
  _id: ObjectId;

  @ObjectIdColumn()
  userId: ObjectId;

  @Column({ default: false })
  isFlowComplete: boolean;

  @Column({ default: Flow.NONE, enum: Flow, type: 'enum' })
  flow: Flow;

  @Column()
  token: string;

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

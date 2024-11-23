import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tokens')
export class Token {
  @ObjectIdColumn()
  _id: ObjectId; // MongoDB's ObjectId for the token document

  @Column()
  userId: string; // Reference to the User entity (can be a UUID or ObjectId)

  @Column()
  @Index({ unique: true }) // Ensures uniqueness of the token value
  token: string; // The token value (JWT or refresh token)

  @Column({ default: false })
  isRevoked: boolean; // Flag to indicate if the token has been revoked

  @Column()
  type: string; // Token type (e.g., "access", "refresh", "magic_link", etc.)

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

  @Column()
  expiresAt: Date; // Expiration time for the token
}

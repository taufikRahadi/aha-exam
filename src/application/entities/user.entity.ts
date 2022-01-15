import { ApiProperty } from '@nestjs/swagger';
import { genSalt, genSaltSync, hashSync } from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  fullname: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  @ApiProperty()
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @ApiProperty({
    type: Date,
  })
  emailVerifiedAt?: Date;

  @Column({
    type: 'enum',
    enum: ['email-password', 'google-oauth'],
    default: 'email-password',
  })
  @ApiProperty({
    type: String,
  })
  signUpMethod?: string;

  @CreateDateColumn()
  @ApiProperty({
    type: Date,
  })
  createdAt?: Date;

  @CreateDateColumn()
  @ApiProperty({
    type: Date,
  })
  updatedAt?: Date;

  @BeforeInsert()
  setPassword?() {
    this.password = hashSync(this.password, genSaltSync(12));
  }
}

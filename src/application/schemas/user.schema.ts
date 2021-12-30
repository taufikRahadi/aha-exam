import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class User {
  @ApiProperty()
  _id?: string;

  @Prop({
    type: String,
    required: true,
  })
  @ApiProperty()
  fullname: string;

  @Prop({
    unique: true,
    type: String,
    required: true,
  })
  @ApiProperty()
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: Date,
    required: false,
  })
  @ApiProperty()
  emailVerifiedAt?: Date;

  @Prop({
    type: Date,
    required: false,
  })
  @ApiProperty()
  createdAt?: Date;

  @Prop({
    type: String,
    required: false,
    default: 'email-password',
  })
  signUpMethod?: string;

  @Prop({
    type: Date,
    required: false,
  })
  @ApiProperty()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass<User>(User);

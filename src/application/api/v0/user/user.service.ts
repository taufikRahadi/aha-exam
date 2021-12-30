import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/application/schemas/user.schema';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async update(id: string, payload: any) {
    try {
      await this.userModel.updateOne(
        {
          _id: id,
        },
        payload,
      );

      return await this.userModel.findOne({
        _id: id,
      });
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string, withPassword = true) {
    try {
      const select = withPassword ? '' : '-password';

      const user = await this.userModel
        .findOne({
          email,
        })
        .select([select]);

      console.log(user);

      return user;
    } catch (err) {
      throw err;
    }
  }

  comparePassword(password: string, hashedPassword: string) {
    const compare = compareSync(password, hashedPassword);
    if (!compare) throw new BadRequestException(`Wrong password`);

    return compare;
  }

  async createUser(payload: User) {
    try {
      payload.password = this.hashPassword(payload.password);
      const user = await this.userModel.create(payload);

      return user;
    } catch (error) {}
  }

  hashPassword(password: string) {
    return hashSync(password, genSaltSync(12));
  }
}

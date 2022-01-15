import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../../entities/user.entity';
import { compareSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async checkEmailVerified(id: string): Promise<boolean> {
    try {
      const user = await this.findUserById(id);

      return Boolean(user.emailVerifiedAt);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, payload: any) {
    try {
      await this.userRepo.update(id, payload);

      return await this.userRepo.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async findUserById(id: string) {
    try {
      const user = await this.userRepo.findOne(id);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string, withPassword = true) {
    try {
      const selectAttr: (keyof User)[] = [
        'id',
        'email',
        'fullname',
        'emailVerifiedAt',
        'signUpMethod',
        'createdAt',
        'updatedAt',
      ];

      withPassword ? selectAttr.push('password') : selectAttr;

      const user = await this.userRepo.findOne({
        where: {
          email,
        },
        select: selectAttr,
      });

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
      const user = await this.userRepo.save(this.userRepo.create(payload));

      return user;
    } catch (error) {
      throw error;
    }
  }
}

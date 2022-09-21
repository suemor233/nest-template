import { compareSync, hashSync } from 'bcrypt'
import { Model } from 'mongoose'
import { nanoid } from 'nanoid'

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { UserModel } from '~/modules/user/user.model'
import { HttpService } from '~/processors/helper/helper.http.service'
import { sleep } from '~/utils/tool.util'

import { UserDto } from './user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
    private readonly httpServie: HttpService,
  ) {}
  async createUser(user: UserDto) {
    const hasMaster = await this.hasMaster()

    if (hasMaster) {
      throw new BadRequestException('我已经有一个主人了哦')
    }
    user.password = hashSync(user.password, 6)
    const authCode = nanoid(10)

    const res = await this.userModel.create({
      ...user,
      authCode,
    })
    return { username: res.username, authCode: res.authCode }
  }

  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username }).select('+password')
    if (!user) {
      await sleep(1000)
      throw new ForbiddenException('用户名不正确')
    }
    if (!compareSync(password, user.password)) {
      await sleep(1000)
      throw new ForbiddenException('密码不正确')
    }

    return user
  }

  async hasMaster() {
    return !!(await this.userModel.count())
  }
}

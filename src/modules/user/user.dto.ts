import {
  IsString
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
export class UserDto {


  @ApiProperty({ required: true })
  @IsString({ message: '用户名' })
  username: string

  @ApiProperty({ required: true })
  @IsString({ message: '密码' })
  password: string
}




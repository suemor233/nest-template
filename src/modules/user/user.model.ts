import { IsString } from 'class-validator'
import { Document } from 'mongoose'

import { Prop, Schema } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

@Schema({
  collection: 'user',
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: false,
  },
  versionKey: false,
})
export class UserModel extends Document {
  @Prop({unique:true})
  @ApiProperty({ required: true })
  @IsString({ message: '用户名' })
  username: string

  @Prop({select:false})
  @ApiProperty({ required: true })
  @IsString({ message: '密码' })
  password: string

  @Prop()
  authCode:string
}

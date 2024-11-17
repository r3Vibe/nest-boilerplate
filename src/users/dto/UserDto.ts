import { JoiSchema, CREATE, UPDATE } from 'nestjs-joi';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @JoiSchema(Joi.string().email().required())
  @JoiSchema([CREATE], Joi.string().email().required())
  @JoiSchema([UPDATE], Joi.string().email().optional())
  @ApiProperty({ example: 'vW5XU@example.com' })
  email: string;

  @JoiSchema(Joi.string().required())
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @JoiSchema(Joi.number().required())
  @JoiSchema([CREATE], Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
  @ApiProperty({ example: 25 })
  age?: number;

  @JoiSchema(Joi.string().required())
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
  @ApiProperty({ example: 'password123' })
  password: string;
}

import {
  Injectable,
  PipeTransform,
  BadRequestException,
  Type,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private readonly type: Type<any>) {}

  async transform(value: any) {
    const object = plainToClass(this.type, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessages = errors.map((error) => {
        return {
          property: error.property,
          constraints: error.constraints,
        };
      });

      throw new BadRequestException({
        statusCode: 1,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    return value;
  }
}

import { PartialType, OmitType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';

export class PartialUserDto extends PartialType(
    OmitType(UserDto, ['password', 'createdAt', 'updatedAt', 'id'])
) {}

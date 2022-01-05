import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { isNotEmptyObject } from 'class-validator';
import { UserDto } from './dto/user.dto';
import { PartialUserDto } from './dto/partial-user.dto';
import { UsersService } from './users.service';
import { Public } from 'src/common/decorators/is-public.decorator';
import { User } from './entities/user.entity';
import { EntityController } from '../common/interfaces/entity-controller.interface'
import { CheckObjectPermissions } from 'src/common/decorators/check-object-permissions.decorator';

@Controller('users')
export class UsersController implements EntityController {
  constructor(private readonly usersService: UsersService) {}
  
  @Public()
  @Post()
  create(@Body(new ValidationPipe({whitelist: true})) userDto: UserDto): Promise<User> {
    return this.usersService.create(userDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @CheckObjectPermissions()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string,) {
    return this.usersService.findOne(id);
  }

  @CheckObjectPermissions()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body(new ValidationPipe({whitelist: true})) partialUserDto: PartialUserDto,
    ) 
  {
    if (!isNotEmptyObject(partialUserDto)) throw new BadRequestException("Payload has no valid keys");

    return this.usersService.update(id, partialUserDto);
  }

  @CheckObjectPermissions()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
  }

  public checkObjectPermissions(id: string, user: User) {
    this.usersService.failIfNotPermitted(id, user)
  }
}

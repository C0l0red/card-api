import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException, ConflictException } from 'src/common/exceptions';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { PartialUserDto } from './dto/partial-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';
import { EntityService } from '../common/interfaces/entity-service.interface'

@Injectable()
export class UsersService implements EntityService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(userDto: UserDto): Promise<User> {
    await this.findByEmail(userDto.email)
      .then(user => {
        if (user) throw new ConflictException("Email in use already")
      });

    let user: User = this.userRepository.create(userDto);
    user.password = await this.hashPassword(user.password);

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOneOrFail(id)
          .catch(() => {
            throw new NotFoundException("No user with ID found")
          });
  }

  async update(id: string, partialUserDto: PartialUserDto): Promise<User> {
    let user: User = await this.findOne(id);
    user = this.userRepository.merge(user, partialUserDto)

    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    let user: User = await this.findOne(id) as User;

    await this.userRepository.remove(user);
  }

  async findByEmail(email: string): Promise<User> {
    if (!isEmail(email)) throw new BadRequestException(`${email} is not a valid email`);

    return this.userRepository
                .createQueryBuilder("user")
                .addSelect("user.password")
                .where("user.email = :email", {email})
                .getOne();
  }

  private async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds);
  }

  async validatePassword(user: User, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, user.password);
  }

  public failIfNotPermitted(entityId: string, currentUser: User) {
    if (entityId != currentUser.id) {
      throw new ForbiddenException("You do not have permission for this action");
    }
  }
  
}

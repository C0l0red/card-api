import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './entities/jwt-payload.entity';

@Injectable()
export class AuthService {
    constructor (
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<UserDto> {
        const user: User = await this.usersService.findByEmail(email);
        const passwordIsValid = async () => await this.usersService.validatePassword(user, password);
        
        if (user && await passwordIsValid()) {
            return UserDto.fromEntity(user);
        }
        
        throw new UnauthorizedException("Invalid User Credentials");
    }

    async login(user: User) {
        const payload: JwtPayload = {email: user.email, id: user.id};
        
        return  {
            access_token: this.jwtService.sign(payload),
        }
    }
}

import { Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service'
import { RequestUser } from '../common/decorators/request-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Public } from 'src/common/decorators/is-public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@RequestUser() user: User) {
        return this.authService.login(user);
    }
}

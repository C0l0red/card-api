import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { ConfigService } from "../../config/config.service";
import { JwtPayload } from "../entities/jwt-payload.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.createJwtOptions().secret
        })
    }

    async validate(payload: JwtPayload): Promise<Partial<User>> {
        return { id: payload.id, email: payload.email };
    }   
    
}
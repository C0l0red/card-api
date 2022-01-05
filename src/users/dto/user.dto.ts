import { Contains, IsAlpha, IsAlphanumeric, IsEmail, Matches, MaxLength, MinLength } from "class-validator";
import { User } from "../entities/user.entity";
import { EntityDto } from "../../common/interfaces/entity-dto.interface";

const validPasswordRegex: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/;

export class UserDto implements EntityDto {

    id?: string;

    @IsEmail()
    email: string;

    @Matches(validPasswordRegex, {
        message: "Password should contain at least an uppercase and lowercase letter, a digit and a symbol"
    })
    @MinLength(8)
    password?: string;

    @IsAlpha()
    @MaxLength(50)
    firstName: string;

    @IsAlpha()
    @MaxLength(50)
    lastName: string;
    
    isActive?: boolean;

    createdAt?: Date;

    updatedAt?: Date;

    static fromEntity(user: User): UserDto {
        const {password, ...createUserDto} = user

        return createUserDto;
    }
}

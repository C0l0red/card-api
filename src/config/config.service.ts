import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ApplicationMode } from './application-mode.enum';

dotenv.config();


@Injectable()
export class ConfigService implements TypeOrmOptionsFactory, JwtOptionsFactory {    
    private env: { [k: string]: string | undefined} = process.env;

    private getValue(key: string, throwOnMissing: boolean = true): string {
        const value = this.env[key];

        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    public getPort(): string {
        return this.getValue("PORT");
    }

    public isProduction(): boolean {
        const mode: ApplicationMode = this.getValue("MODE", false) as ApplicationMode;
        
        if (mode == ApplicationMode.PRODUCTION) return true;
        else if (mode == ApplicationMode.DEVELOPMENT) return false;
        else throw new Error("Wrong application mode"); 
    }

    public createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: "postgres",

            host: this.getValue("POSTGRES_HOST"),
            port: parseInt(this.getValue("POSTGRES_PORT")),
            username: this.getValue("POSTGRES_USER"),
            password: this.getValue("POSTGRES_PASSWORD"),
            database: this.getValue("POSTGRES_DATABASE"),

            entities: ["dist/**/*.entity.{ts,js}"],

            migrationsTableName: "migration",
            migrations: ["dist/migration/*.{ts,js}"],

            cli: {
                migrationsDir: "src/migration",
            },

            ssl: this.isProduction(),

        };
    }

    public createJwtOptions(): JwtModuleOptions {
        return {
            secret: this.getValue("SECRET_KEY"),
            signOptions: {
                expiresIn: parseInt(this.getValue("JWT_TTL")),
            },
        }
    }
}

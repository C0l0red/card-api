import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Entity as EntityInterface } from "src/common/interfaces/entity.interface";

@Entity()
export class User implements EntityInterface {
    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", length: 120, unique: true})
    email: string;

    @Exclude()
    @Column({type: "varchar", length: 60, select: false})
    password: string;

    @Column({type: "varchar", length: 50})
    firstName: string;

    @Column({type: "varchar", length: 50})
    lastName: string;

    @Column({default: true})
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
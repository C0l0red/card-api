import { Entity } from "./entity.interface";
import { EntityDto } from "./entity-dto.interface";

export interface EntityService {
    create(entityDto: EntityDto): Promise<Entity>;
    findAll(): Promise<Entity[]>;
    findOne(id: string): Promise<Entity>;
    update(id: string, partialEntityDto: Partial<EntityDto>): Promise<Entity>;
    remove(id: string): Promise<void>;
    failIfNotPermitted(entityId: string, currentUser: any): void;
}
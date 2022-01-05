import { EntityDto } from "./entity-dto.interface";
import { Entity } from "./entity.interface";

export interface EntityController {
    create(entityDto: EntityDto): Promise<Entity>;
    findAll(): Promise<Entity[]>
    findOne(id: string, requestUser: Entity): Promise<Entity>
    update(id: string, partialEntityDto: Partial<EntityDto>, requestUser: Entity): Promise<Entity>
    remove(id: string, requestUser: Entity): Promise<void>;
    checkObjectPermissions(id: string, requestUser: Entity): void
}
import { ExecutionContext, CanActivate, Injectable } from "@nestjs/common";
import {Request} from "express";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { EntityController } from "../interfaces/entity-controller.interface";
import { ModuleRef } from "@nestjs/core";
import { Entity } from "../interfaces/entity.interface";
import { CHECK_OBJECT_PERMISSIONS } from "../decorators/check-object-permissions.decorator";

@Injectable()
export class ObjectPermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly moduleRef: ModuleRef
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const checkObjectPermissions = this.reflector.getAllAndOverride<boolean>(
            CHECK_OBJECT_PERMISSIONS, 
            [
                context.getHandler(),
                context.getClass(),
            ]
        );
        
        if (!checkObjectPermissions) {
            return true;
        }

        const ControllerClass = context.getClass<EntityController>()

        const controller: EntityController = this.moduleRef.get(ControllerClass, {strict: false});
        const request: Request = context.switchToHttp().getRequest();
        const {params, user} = request

        controller.checkObjectPermissions(params.id, user as Entity);

        return true
    }
}

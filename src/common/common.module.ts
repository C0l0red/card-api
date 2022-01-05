import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ObjectPermissionsGuard } from './guards/object-permissions.guard';

@Module({
    providers: [
        {
            provide: APP_GUARD,
            useClass: ObjectPermissionsGuard
        }
    ]
})
export class CommonModule {}

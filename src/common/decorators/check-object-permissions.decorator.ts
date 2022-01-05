import { SetMetadata } from "@nestjs/common";

export const CHECK_OBJECT_PERMISSIONS = "checkObjectPermissions";

export const CheckObjectPermissions = () => SetMetadata(CHECK_OBJECT_PERMISSIONS, true);
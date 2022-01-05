import {HttpException, HttpStatus} from "@nestjs/common";

export class DatabaseException extends HttpException {
    constructor(message="Database Error", status=HttpStatus.INTERNAL_SERVER_ERROR) {
        super(message, status);
    }
}
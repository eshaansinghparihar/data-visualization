import { HttpCode } from "../core/constants";

export class BadRequestError extends Error {
    status: HttpCode;
    constructor(message:string) {
        super(message);
        this.name = 'BadRequestError';
        this.status = HttpCode.BAD_REQUEST;
    }
}

export class InternalServerError extends Error {
    status: HttpCode;
    constructor(message:string) {
        super(message);
        this.name = 'InternalServerError';
        this.status = HttpCode.INTERNAL_SERVER_ERROR;
    }
}
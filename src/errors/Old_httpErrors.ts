import { ApiError } from "./ApiError.js";

export class BadRequestError extends ApiError {
    constructor(message = "Bad request", details?: any) {
        super(400, message, details);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
        super(401, message);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = "Forbidden") {
        super(403, message);
    }
}

export class NotFoundError extends ApiError {
    constructor(resource = "Resource") {
        super(404, `${resource} not found`);
    }
}

export class ConflictError extends ApiError {
    constructor(message = "Conflict") {
        super(409, message);
    }
}
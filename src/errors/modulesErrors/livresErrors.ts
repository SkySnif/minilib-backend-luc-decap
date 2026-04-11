// src/utils/errors/businessErrors.ts

import { ConflictError, NotFoundError } from "@hendec/backend/utils";

export class DuplicateLivreError extends ConflictError {
    constructor() {
        super("Duplicate data");
    }
}

export class LivreNotFoundError extends NotFoundError {
    constructor() {
        super("Livre");
    }
}

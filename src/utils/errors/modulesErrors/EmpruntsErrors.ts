// src/utils/errors/businessErrors.ts

import { ConflictError, NotFoundError } from "../httpErrors.js";

export class DuplicateEmpruntsError extends ConflictError {
    constructor() {
        super("Duplicate data");
    }
}

export class EmpruntNotFoundError extends NotFoundError {
    constructor() {
        super("Emprunt");
    }
}

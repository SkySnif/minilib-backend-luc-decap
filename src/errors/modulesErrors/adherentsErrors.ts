// src/utils/errors/businessErrors.ts

import { ConflictError, NotFoundError } from "@hendec/backend/utils";

export class DuplicateAdherentsError extends ConflictError {
    constructor() {
        super("Duplicate data");
    }
}

export class AdherentNotFoundError extends NotFoundError {
    constructor() {
        super("Adherent");
    }
}

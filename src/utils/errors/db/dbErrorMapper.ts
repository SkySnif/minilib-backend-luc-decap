// src/utils/errors/dbErrorMapper.ts

import type { DBErrorType } from "./dbErrorTypes.js";

export function mapDBError(err: any): DBErrorType {
    // PostgreSQL
    if (err.code === "23505") return "unique_violation";
    if (err.code === "23503") return "foreign_key_violation";
    if (err.code === "42703") return "undefined_column"; 
    
    // MySQL
    if (err.code === "ER_DUP_ENTRY") return "unique_violation";
    if (err.code === "ER_ROW_IS_REFERENCED_2") return "foreign_key_violation";

    // SQLite
    if (err.code === "SQLITE_CONSTRAINT") {
        if (err.message.includes("UNIQUE")) return "unique_violation";
        if (err.message.includes("FOREIGN KEY")) return "foreign_key_violation";
    }

    return "other";
}
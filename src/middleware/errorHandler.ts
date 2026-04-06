// backend/src/middleware/errorHandler.ts

import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/errors/ApiError.js";

const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    // Erreur connue
    // Surchager les fonctions dans ApiError
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            ...(err.details ? { details: err.details } : {})
        });
        return;
    }

    // Erreur inconnue
    console.error("Unexpected error:", err.message);

    res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
};

export default errorHandler;

// import { ZodType } from "zod";

// import type { Request, Response, NextFunction } from "express";
// import { BadRequestError } from "../utils/errors/index.js";

// export const validate = (schema: ZodType) =>
//     (req: Request, res: Response, next: NextFunction) => 
//     {
//         const result = schema.safeParse(req.body);

//         if (!result.success) 
//             throw new BadRequestError("Validation failed", result.error.issues);

//         req.body = result.data; // typé et clean
//         next();
//     };

// export default validate;
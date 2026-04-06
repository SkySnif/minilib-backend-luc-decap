// backend/src/controllers/empruntsController.js
import type { Request, Response } from 'express';

import { NotFoundError } from "../utils/errors/index.js";

import type { Emprunt } from '../validators/empruntShema.js';
//import { Emprunt } from '../types/emprunt.js';

import * as empruntsModel from '../models/empruntsModel.js';

/** GET /api/v1/emprunts */
export const getEmprunts = async ( 
    req: Request<{}, Emprunt[], {}, {}>,
    res: Response) : Promise<void> => 
{
    const emprunts: Emprunt[] = await empruntsModel.findAll();

    // TODO: Add criteria like livres
    if (emprunts.length === 0)
        throw new NotFoundError( "No emprunts find with these criteria");

    res.json( emprunts);
};

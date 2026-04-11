// backend/src/controllers/empruntsController.js
import type { Request, Response } from 'express';

import { NotFoundError } from "@hendec/backend/utils";

import type { Emprunt } from '@hendec/types/minilib';
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

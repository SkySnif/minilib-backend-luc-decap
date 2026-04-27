// backend/src/controllers/adherentsController.js
import type { Request, Response } from 'express';

import { BadRequestError, NotFoundError } from "@hendec/backend/utils";
import { getValidated } from '@hendec/backend';

import type { paramIdSchemaDto } from '@hendec/types/param';
import type { Adherent, CreateAdherentDto, UpdateAdherentDto, DeleteAdherentDto, FilterAdherentDto, DeleteLivreDto } from '@hendec/types/minilib';

import * as adherentsModel from '../models/adherentsModel.js';

/** GET /api/v1/adherents */
export const getAdherents = async ( 
    req: Request,
    res: Response
) : Promise<void> => 
{
    // Midlleware zod valide : when Request is validated in the route, create a req.validated?params/body/query when validate is done. 
    // Avoid to parse again. getValidated<T> return the validated message at the expected type
    const parsedFilters = getValidated<FilterAdherentDto>(req.validated?.query);

    const adherents: Adherent[] = await adherentsModel.findAll(parsedFilters);

    if (adherents.length === 0)
        throw new NotFoundError( "Member find with these criteria")

    // No zod parsing for the output, done by middleware route
    res.json( adherents);
};

/**
 * GET /api/v1/adherents/:id
 * Get Adherent by id
 *
 */
export const getAdherentById = async ( 
    req: Request,
    res: Response
) : Promise<void> => 
{   
    const parsedParams = getValidated<paramIdSchemaDto>(req.validated?.params);

    const adherent: Adherent = await adherentsModel.findById( parsedParams.id);

    if ( !adherent)
        throw new NotFoundError(`Member id ${parsedParams.id}`);

    res.json(adherent);
};

/** POST /api/v1/adherents */
export const createAdherent = async ( 
    req: Request,
    res: Response
) : Promise<void> => 
{
    // Midlleware zod valide : when Request is validated in the route, create a req.validated?params/body/query when validate is done. 
    // Avoid to parse again. getValidated<T> return the validated message at the expected type
    const parsedData = getValidated<CreateAdherentDto>(req.validated?.body);

    const nouveau: Adherent = await adherentsModel.create( parsedData);

    res.status(201).json( nouveau);
};


/**
* update an existing member
* PUT /api/v1/adherent/:id
*
*/
export const updateAdherent = async ( 
    req: Request,
    res: Response
) : Promise<void> => 
{
    const parsedParams = getValidated<paramIdSchemaDto>(req.validated?.params);
    const parsedData = getValidated<UpdateAdherentDto>(req.validated?.body);

    const misAJour: Adherent|null = await adherentsModel.update( parsedParams.id, parsedData);

    if ( !misAJour) 
        throw new NotFoundError(`Member id ${parsedParams.id}`);

    res.json( misAJour);
};

/** DELETE /api/v1/adherents/:id — soft delete */
export const desactiverAdherent = async ( 
    req: Request,
    res: Response
) : Promise<void> => 
{
        // Midlleware zod valide : when Request is validated in the route, create a req.validated?params/body/query when validate is done. 
        // Avoid to parse again. getValidated<T> return the validated message at the expected type
        const parsedParams = getValidated<paramIdSchemaDto>(req.validated?.params);

        const adherent: Adherent = await adherentsModel.desactiver(parsedParams.id);

        if ( !adherent)
            throw new NotFoundError(`Member id ${parsedParams.id}`);

        res.json( adherent);
};
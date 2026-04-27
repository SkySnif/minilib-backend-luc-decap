// backend/src/controllers/empruntsController.js
import type { Request, Response } from 'express';
import { addDays, differenceInDays } from "date-fns";

import { ForbiddenError, NotFoundError } from "@hendec/backend/utils";
import { getValidated } from '@hendec/backend';

import type { paramIdSchemaDto } from '@hendec/types/param';
import type { CreateEmpruntDto, UpdateEmpruntDto, FilterEmpruntDto, ReturnEmpruntDto, Livre, Adherent, EmpruntsResponseDto } from '@hendec/types/minilib';

import * as empruntsModel from '../models/empruntsModel.js';
import * as livresModel from '../models/livresModel.js';
import * as adherentsModel from '../models/adherentsModel.js';

/** GET /api/v1/emprunts */
export const getEmprunts = async ( 
    req: Request,
    res: Response
) : Promise<void> => 
{
    // Midlleware zod valide : when Request is validated in the route, create a req.validated?params/body/query when validate is done. 
    // Avoid to parse again. getValidated<T> return the validated message at the expected type
    const parsedFilters = getValidated<FilterEmpruntDto>(req.validated?.query);

    const emprunts: EmpruntsResponseDto[] = await empruntsModel.findAll(parsedFilters);

    if (emprunts.length === 0)
        throw new NotFoundError( "Loan find with these criteria")

    // No zod parsing for the output, done by middleware route
    res.json( emprunts);
};

/**
 * GET /api/v1/emprunts/:id
 * Get Emprunt by id
 *
 */
export const getEmpruntById = async ( 
    req: Request,
    res: Response
) : Promise<void> => 
{
    const parsedParams = getValidated<paramIdSchemaDto>(req.validated?.params);

    const emprunt: EmpruntsResponseDto = await empruntsModel.findById( parsedParams.id);

    if ( !emprunt)
        throw new NotFoundError(`Loan id ${parsedParams.id}`);

    res.json(emprunt);
};

/** POST /api/v1/emprunts */
export const createEmprunt = async ( 
    req: Request,
    res: Response
) : Promise<void> => 
{
    const loanMaxDayDuration : number = 14;
    const loanMaxNumber : number = 3;

    // Midlleware zod valide : when Request is validated in the route, create a req.validated?params/body/query when validate is done. 
    // Avoid to parse again. getValidated<T> return the validated message at the expected type
    let parsedData = getValidated<CreateEmpruntDto>(req.validated?.body);

    const [ livre, adherent, numberAlreadyBooked] = await Promise.all(
        [
            livresModel.findById( parsedData.livre_id),
            adherentsModel.findById( parsedData.adherent_id),
            empruntsModel.countAdherentAlreadyBooked(parsedData.adherent_id)
        ]);

    console.log( numberAlreadyBooked);
    if (!livre)
        throw new NotFoundError( `Book id ${parsedData.livre_id}`);

    if (!adherent)
        throw new NotFoundError( `Member id ${parsedData.adherent_id}`);

    // Check if the number of loan is not superior to what allow per member
    if ( numberAlreadyBooked > loanMaxNumber )
        throw new ForbiddenError( `you cannot borrow more than ${loanMaxNumber} bools at the same time`);

    // if date_emprunt is not defined put today as default value  
    const dateEmprunt = parsedData.date_emprunt
        ? new Date(parsedData.date_emprunt)
        : new Date();

    // if date_retour_prevue is not defined put today + max loan duration as default  
    const dateRetourPrevue = parsedData.date_retour_prevue
        ? new Date(parsedData.date_retour_prevue)
        : addDays(dateEmprunt, loanMaxDayDuration);

    // Calculate loan duration asked in days  
    const loanDuration = differenceInDays(dateRetourPrevue, dateEmprunt);
    
    // Check if the loan duration is not exceeded - 
    if ( loanDuration  > loanMaxDayDuration )
        throw new ForbiddenError( `you cannot borrow a book for more than ${loanMaxDayDuration} days`);

    // All checked ok - loan the book
    const nouveau: EmpruntsResponseDto = await empruntsModel.create( parsedData);

    res.status(201).json( nouveau);
};


/**
* update an existing loan
* PUT /api/v1/emprunt/:id
*
*/
export const updateEmprunt = async ( 
    req: Request,
    res: Response
) : Promise<void> => 
{
    const parsedParams = getValidated<paramIdSchemaDto>(req.validated?.params);
    const parsedData = getValidated<UpdateEmpruntDto>(req.validated?.body);
        
    const misAJour: EmpruntsResponseDto|null = await empruntsModel.update( parsedParams.id, parsedData);

    if ( !misAJour)  
        throw new NotFoundError(`Loan id ${parsedParams.id}`);

    res.json( misAJour);
};

/** DELETE /api/v1/emprunts/:id — soft delete */
export const deleteEmprunt = async ( 
    req: Request,
    res: Response
) : Promise<void> => 
{
        // Midlleware zod valide : when Request is validated in the route, create a req.validated?params/body/query when validate is done. 
        // Avoid to parse again. getValidated<T> return the validated message at the expected type
        const parsedParams = getValidated<paramIdSchemaDto>(req.validated?.params);
        const parsedData = getValidated<ReturnEmpruntDto>(req.validated?.body);

        const emprunt: EmpruntsResponseDto = await empruntsModel.returnBook(parsedParams.id, parsedData);

        if ( !emprunt)
            throw new NotFoundError(`Delete loan id ${parsedParams.id}`);

        res.json( emprunt);
};
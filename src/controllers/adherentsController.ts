// backend/src/controllers/adherentsController.js
import type { Request, Response } from 'express';

import { BadRequestError, NotFoundError } from "@hendec/backend/utils";

//import { Adherent, CreateAdherentDto } from '../types/adherent.js';
import type { Adherent, CreateAdherentDto, UpdateAdherentDto, DeleteAdherentDto } from '@hendec/types/minilib';

import * as adherentsModel from '../models/adherentsModel.js';

/** GET /api/v1/adherents */
//TODO : Add FilterDto and logic
export const getAdherents = async ( 
    req: Request<{}, Adherent[], {}, {}>,
    res: Response) : Promise<void> => 
{
    const adherents: Adherent[] = await adherentsModel.findAll();

    // TODO: Add criteria like livres
    if (adherents.length === 0)
        throw new NotFoundError( "No adherents find with these criteria")

    res.json( adherents);
};

/**
 * GET /api/v1/adherents/:id
 * Get Adherent by id
 *
 * @async
 * @param {Request<{id: string}, Adherent, {}, {}>} req 
 * @param {Response} res 
 * @returns {Promise<void>} 
 */
export const getAdherentById = async ( 
    req: Request<{id: string}, Adherent, {}, {}>,
    res: Response) : Promise<void> => 
{   
   const id: number = Number(req.params.id)
    if (isNaN(id))
        throw new BadRequestError( `Id invalide`);

    const adherent: Adherent = await adherentsModel.findById( id);

    if ( !adherent)
        throw new NotFoundError(  `Adhérent id:${req.params.id} introuvable`);

    res.json(adherent);
};

/** POST /api/v1/adherents */
export const createAdherent = async ( 
    req: Request<{}, Adherent, CreateAdherentDto, {}>,
    res: Response) : Promise<void> => 
{
    console.log('Hello')
    // Obselete with zod validation
    const champsObligatoires: (keyof CreateAdherentDto)[] = ['nom','prenom','email'];
    const manquants = champsObligatoires.filter( k => !req.body[k]);

    if ( manquants.length > 0)
        throw new BadRequestError( 'Champs manquants', { champs: manquants } );

    const nouveau: Adherent = await adherentsModel.create( req.body);

    res.status(201).json( nouveau);
};


/**
* Met à jour un livre existant.
* PUT /api/v1/adherent/:id
*
*/
export const updateAdherent = async ( 
    req: Request<{id : string}, Adherent,  UpdateAdherentDto, {}>,
    res: Response
) : Promise<void> => 
{
   const id: number = Number(req.params.id)
    if (isNaN(id))
        throw new BadRequestError('Id invalide');
    
    const misAJour = await adherentsModel.update( id, req.body);

    if ( !misAJour) 
        throw new NotFoundError(`Livre id:${req.params.id} non trouvé`);

    res.json( misAJour);
};

/** DELETE /api/v1/adherents/:id — soft delete */
export const desactiverAdherent = async ( 
    req: Request<{id: string}, Adherent, {}, {}>,
    res: Response) : Promise<void> => 
{
   const id: number = Number(req.params.id)
    if (isNaN(id))
        throw new NotFoundError( 'Id invalide');

    const adherent: Adherent = await adherentsModel.desactiver( id);

    if ( !adherent)
        throw new BadRequestError(  'Adhérent id:${req.params.id} introuvable');

    res.json( adherent);
};
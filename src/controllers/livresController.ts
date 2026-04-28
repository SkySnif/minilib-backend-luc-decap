// ─── backend/src/controllers/livresController.js ──────────────────────
// Controller pour les livres — logique métier entre les routes et les données

import type { Request, Response } from 'express';

import { NotFoundError } from "@hendec/backend/utils";
import { getValidated } from '@hendec/backend';
 
import type { ParamIdDto } from '@hendec/types/param';
import type { CreateLivreDto, FiltresLivreDto, UpdateLivreDto, DeleteLivreDto, LivreResponseDto, LivresResponseDto } from "@hendec/types/minilib";

import * as livresModel from '../models/livresModel.js';

/**
* Récupère tous les livres avec filtres optionnels via query params.
* GET /api/v1/livres?genre=Informatique&disponible=true&recherche=clean
*
*/
export const getLivres = async( 
    req: Request,
    res: Response
) : Promise<void> => 
{
        const parsedFilters = getValidated<FiltresLivreDto>(req.validated?.query);

        // req.query contient les paramètres de l'URL (?genre=...&disponible=...)
        const livres: LivresResponseDto[] = await livresModel.findAll( parsedFilters);

        if (livres.length === 0)
            throw new NotFoundError( "Book with these criteria")

        res.json( livres);
};

/**
* Récupère un livre par son id.
* GET /api/v1/livres/:id
*
*/
export const getLivreById = async( 
    req: Request,
    res: Response
) : Promise<void> =>
{
    const parsedParams = getValidated<ParamIdDto>( req.validated?.params);

    const livre: LivreResponseDto | null = await livresModel.findById( parsedParams);

   if (!livre)
        throw new NotFoundError( `Book id ${parsedParams.id}`);

    res.json( livre);
};

/**
* Crée un nouveau livre.* POST /api/v1/livres
* Body JSON attendu : { isbn, titre, auteur, annee, genre }
*
*/
export const createLivre = async ( 
    req: Request,
    res: Response
) : Promise<void> => 
{
    // Midlleware zod valide : when Request is validated in the route, create a req.validated?params/body/query when validate is done. 
    // Avoid to parse again. getValidated<T> return the validated message at the expected type
    const parsedData = getValidated<CreateLivreDto>( req.validated?.body);

    const nouveau: LivreResponseDto = await livresModel.create( parsedData);

    // 201 Created — ressource créée avec succès
    res.status(201).json( nouveau);
};

/**
* Update a book.
* PUT /api/v1/livres/:id
*
*/
export const updateLivre = async ( 
    req: Request,
    res: Response
) : Promise<void> => 
{
    const parsedParams = getValidated<ParamIdDto>(req.validated?.params);
    const parsedData = getValidated<UpdateLivreDto>(req.validated?.body);

    const misAJour: LivresResponseDto | null = await livresModel.update( parsedParams, parsedData);

    if ( !misAJour) 
        throw new NotFoundError( `Book id ${parsedParams.id}`);

    res.json( misAJour);
};

/**
* Delete a book.
* DELETE /api/v1/livres/:id
*/
export const deleteLivre = async ( 
    req: Request,
    res: Response
) : Promise<void> => 
{
    const parsedParams = getValidated<DeleteLivreDto>(req.validated?.params);
    
    const supprimé: boolean = await livresModel.remove(parsedParams);

    if ( !supprimé) 
        throw new NotFoundError( `Book id ${parsedParams.id}`);

    // 204 No Content — succès sans corps de réponse
    res.status(204).send();
};

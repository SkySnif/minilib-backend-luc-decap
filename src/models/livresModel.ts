// backend/src/models/livresModel.js

/**
* Accès aux données livres via PostgreSQL.
* Remplace l'ancien livresData.js en mémoire.
* Toutes les fonctions sont async — elles retournent des Promises.
*
* @module livresModel
*/
import type { QueryResult} from '@hendec/types/db';

import { mapDBError } from "@hendec/backend/utils";
import { prepareInsert } from '@hendec/backend/utils';

import pool from '../config/database.js';

// Error manager for specific error to catch associated to livres
import { DuplicateLivreError  } from "../errors/livresErrors.js";

import type { ParamIdDto } from "@hendec/types/param";
import type { FiltresLivreDto, CreateLivreDto, UpdateLivreDto, DeleteLivreDto, LivreResponseDto  } from "@hendec/types/minilib";

// ───────────────────────────────────────────────────────────────
// ──── CONST for easier change in DB
// ───────────────────────────────────────────────────────────────
const livresTableName: string = "t_livres"
const livresSelectView: string = "livres"

/**
* retrieve all books with optional filters
*/
export const findAll = async ( 
    filtres: FiltresLivreDto = {}
) : Promise<LivreResponseDto[]> => 
{
    const conditions: string[] = [];
    const valeurs: string[] = [];
    let idx:number = 1;

    if ( filtres.genre !== undefined ) 
    {
        conditions.push( `genre = $${idx++}`);
        valeurs.push( filtres.genre);
    }

    if ( filtres.disponible !== undefined ) 
    {
        conditions.push( `disponible = $${idx++}`);
        valeurs.push( filtres.disponible);
    }

    if ( filtres.recherche ) 
    {
        conditions.push( `(titre ILIKE $${idx} OR auteur ILIKE $${idx})`);
        valeurs.push( `%${filtres.recherche}%`);
        idx++;
    }

    const where: string = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    console.log( valeurs);    
    console.log(         `SELECT 
            * 
        FROM 
            ${livresSelectView}
        ${where} 
        ORDER BY 
            titre`,
);    


    const result: QueryResult<LivreResponseDto> = await pool.query<LivreResponseDto>(
        `SELECT 
            * 
        FROM 
            ${livresSelectView}
        ${where} 
        ORDER BY 
            titre`,
        valeurs
    )

    return result.rows;
};

/**
* Find a book with is Id.
*/
export const findById = async (
    paramSelectId: ParamIdDto
)
: Promise<LivreResponseDto | null> => 
{
    try
    {
        const result: QueryResult<LivreResponseDto> = await pool.query<LivreResponseDto>(
            `SELECT 
                * 
            FROM 
                ${livresSelectView}
            WHERE 
                id = $1`, 
            [paramSelectId.id]
        );

        return result.rows[0] || null;
    }
    catch (err: any) 
    {
        // Map error code Postgres or other with a custom type
        const type: string = mapDBError( err);

        if ( type === "unique_violation" )
            throw new DuplicateLivreError();

        throw err; // other DB error not customized
    }    
};

/**
* Create a new book
*/
export const create = async ( 
    data: CreateLivreDto
): Promise<LivreResponseDto> => 
{
    try {

        // Retrieve the list of the CreateLivreDto's fields 
        const entries:[keyof CreateLivreDto, string | number | boolean][] = Object.entries(data).filter(
                ([, v]) => v !== undefined
            ) as [keyof CreateLivreDto, string | number | boolean][];

        const champs: (string | number | boolean | symbol )[] = entries.map(([k]) => k);
        const valeurs:(string | number | boolean | symbol )[] = entries.map(([, v]) => v);

        // Build values string for SQL
        const SQLField: string = champs.join(', ');
        const SQLqueryvalue: string = champs.map((_, i) => `$${i + 1}`).join(', ');

        const result: QueryResult<LivreResponseDto> = await pool.query<LivreResponseDto>( 
            `INSERT INTO 
                ${livresSelectView} (${SQLField})
            VALUES 
                (${SQLqueryvalue})
            RETURNING 
                *`,
            valeurs
        );

        return result.rows[0];
    }
    catch (err: any) 
    {
        // Map error code Postgres or other with a custom type
        const type: string = mapDBError( err);

        if ( type === "unique_violation" )
            throw new DuplicateLivreError();

        throw err; // other DB error not customized
    }
};

/**
* update a Book
*/
export const update = async ( 
    paramUpdateId: ParamIdDto,
    updateLivreData: UpdateLivreDto
): Promise<LivreResponseDto | null> => 
{
    try
    {
        // Construction dynamique du SET
        const champs: string[] = Object.keys( updateLivreData);
        const valeurs: (string | number | boolean | null)[] = Object.values(updateLivreData);

        if ( champs.length === 0) 
            return findById( paramUpdateId);

        const setClause: string = champs.map((c, i) => `${c} = $${i + 1}`).join(', ');

        // Id is last because value is $[index_arg] where the arg is ...champs + id
        const result: QueryResult<LivreResponseDto> = await pool.query<LivreResponseDto>(
            `UPDATE 
                ${livresTableName} 
            SET 
                ${setClause} 
            WHERE 
                id = $${champs.length + 1}
            RETURNING 
                *`,
            [...valeurs, paramUpdateId.id]
        );

        return result.rows[0] || null;
    }
    catch (err: any) 
    {
        // Map error code Postgres or other with a custom type
        const type: string = mapDBError( err);

        if ( type === "unique_violation" )
            throw new DuplicateLivreError();

        throw err; // other DB error not customized
    }    
};

/**
* Delete a book
*/
export const remove = async (
    deleteParam: DeleteLivreDto
): Promise<boolean> => 
{
    try
    {
        const result: QueryResult<LivreResponseDto> = await pool.query<LivreResponseDto>(
            `DELETE FROM 
                ${livresTableName} 
            WHERE 
                id = $1 
            RETURNING 
                id`, 
            [deleteParam.id]
        );

        return result.rowCount ? true : false;
    }
    catch (err: any) 
    {
        // Map error code Postgres or other with a custom type
        const type: string = mapDBError( err);

        if ( type === "unique_violation" )
            throw new DuplicateLivreError();

        throw err; // other DB error not customized
    }    
};

// backend/src/models/livresModel.js

/**
* Accès aux données livres via PostgreSQL.
* Remplace l'ancien livresData.js en mémoire.
* Toutes les fonctions sont async — elles retournent des Promises.
*
* @module livresModel
*/

import pool from '../config/database.js';
import type { QueryResult } from '../types/queryResult.js';

// Manage to converte error code by DB in global error code
import { mapDBError } from "../utils/errors/db/dbErrorMapper.js";

// Error manager for specific error to catch associated to livres
import { DuplicateLivreError  } from "../utils/errors/modulesErrors/livresErrors.js";

// import { Livre, FiltresLivre, CreateLivreDto } from '../types/livre.js';
import type { Livre, FiltresLivre, CreateLivreDto } from "@hendec/types/minilib";

/**
* Récupère tous les livres avec filtres optionnels.
*
* @async
* @param {FiltresLivre} [filtres={}]
* @returns {Promise<Livre[]>}
*/
export const findAll = async ( filtres: FiltresLivre = {}) : Promise<Livre[]> => 
{
    const conditions: string[] = [];
    const valeurs: string[] = [];
    let idx:number = 1;

    if ( filtres.genre !== undefined) 
    {
        conditions.push( `genre = $${idx++}`);
        valeurs.push( filtres.genre);
    }

    if ( filtres.disponible !== undefined) 
    {
        conditions.push( `disponible = $${idx++}`);
        valeurs.push( String( filtres.disponible));
    }

    if ( filtres.recherche) 
    {
        conditions.push( `(titre ILIKE $${idx} OR auteur ILIKE $${idx})`);
        valeurs.push( `%${filtres.recherche}%`);
        idx++;
    }

    // TODO : Remove WHERE and just concat AND * - and add 1=1 in WHERE clause in SQL statement
    const where: string = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const result: QueryResult<Livre> = await pool.query<Livre>(
        `SELECT 
            * 
        FROM 
            livres 
        ${where} 
        ORDER BY 
            titre`,
        valeurs
    )

    return result.rows;
};

/**
* Trouve un livre par son id.
* @async
* @param {number} id
* @returns {Promise<Livre|null>} Livre ou null
*/
export const findById = async (id: number) : Promise<Livre|null> => 
{
    const result: QueryResult<Livre> = await pool.query<Livre>(
        `SELECT 
            * 
        FROM 
            livres
        WHERE 
            id = $1`, 
        [id]
    );

    return result.rows[0] || null;
};

/**
* Crée un nouveau livre.
* @async
* @param {CreateLivreDto} data
* @returns {Promise<Livre>} Le livre créé avec son id
*/
export const create = async ( data: CreateLivreDto): Promise<Livre> => 
{
    try {

        // Retrieve the list of the CreateLivreDto's fields 
        const entries:[keyof CreateLivreDto, string | number | boolean][] = Object.entries(data).filter(
            ([, v]) => v !== undefined
        ) as [keyof CreateLivreDto, string | number | boolean][];

        const champs: (string | number | boolean )[] = entries.map(([k]) => k);
        const valeurs:(string | number | boolean )[] = entries.map(([, v]) => v);

        // Build values string for SQL
        const SQLqueryvalue: string = champs.map((_, i) => `$${i + 1}`).join(', ');
        const SQLField: string = champs.join(', ');

        const result: QueryResult<Livre> = await pool.query<Livre>( 
            `INSERT INTO 
                livres (${SQLField})
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
        const type: string = mapDBError( err);

        if ( type === "unique_violation")
            throw new DuplicateLivreError();

        throw err; // autres erreurs DB
    }
};

/**
* Met à jour un livre.
* @async
* @param {number} id
* @param {Livre} data - Champs à modifier
* @returns {Promise<Livre|null>} Livre mis à jour ou null
*/
export const update = async ( 
    id: number, 
    data:Partial<Livre>): Promise<Livre|null> => 
{
    // Construction dynamique du SET
    const champs: string[] = Object.keys( data);
    const valeurs: (string | number | boolean | null)[] = Object.values(data);

    if ( champs.length === 0) 
        return findById(id);

    const setClause: string = champs.map((c, i) => `${c} = $${i + 1}`).join(', ');

    const result: QueryResult<Livre> = await pool.query<Livre>(
        `UPDATE 
            livres 
        SET 
            ${setClause} 
        WHERE 
            id = $${champs.length + 1} 
        RETURNING 
            *`,
        [...valeurs, id]
    );

    return result.rows[0] || null;
};

/**
* Supprime un livre.
* @async
* @param {number} id
* @returns {Promise<boolean>} true si supprimé
*/
export const remove = async (id: number): Promise<boolean> => 
{
    const result: QueryResult<Livre> = await pool.query<Livre>(
        `DELETE FROM 
            livres 
        WHERE 
            id = $1 
        RETURNING 
            id`, 
        [id]
    );

    return result.rowCount ? true : false;
};

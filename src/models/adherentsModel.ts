// backend/src/models/adherentsModel.js
/**
* Accès aux données adhérents via PostgreSQL.
* @module adherentsModel
*/
import type { QueryResult, CountRow} from '@hendec/types/db';

import { mapDBError } from "@hendec/backend/utils";
import { prepareInsert, prepareWhere } from '@hendec/backend/utils';

import pool from '../config/database.js';

// Error manager for specific error to catch associated to livres
import { DuplicateAdherentsError } from "../errors/adherentsErrors.js";

import type { FilterAdherentDto, CreateAdherentDto, UpdateAdherentDto, DeleteAdherentDto, AdherentResponseDto } from '@hendec/types/minilib';

// ───────────────────────────────────────────────────────────────
// ──── CONST for easier change in DB
// ───────────────────────────────────────────────────────────────
const adherentsTableName: string = "t_adherents"
const adherentsSelectViewName: string = "adherents"

// ───────────────────────────────────────────────────────────────
// ──── Private function ─ not exposed to route ───────────────────────
// ───────────────────────────────────────────────────────────────

/**
* Génère un numéro adhérent unique au format ADH-XXX.
* @async
* @returns {Promise<string>} Numéro adhérent
*/
const genererNumeroAdherent = async (): Promise<string> => 
{
    const result: QueryResult<CountRow> = await pool.query<CountRow>( 'SELECT COUNT(*) FROM adherents');
    const count: Number = parseInt( result.rows[0].count) + 1;

    return `ADH-${String(count).padStart(3, '0')}`; // ADH-001, ADH-042...
};

// ───────────────────────────────────────────────────────────────
// ──── Export function ─ exposed to route ───────────────────────
// ───────────────────────────────────────────────────────────────
/**
 * Return list of member
 * filter optional
 *
 */
export const findAll = async (
    filters: FilterAdherentDto = {}
) : Promise<AdherentResponseDto[]> => 
{
    // remove specific fields not in DB like search - specific condition will be added after the sql builder prepare select
    const { search, ...dbFilters } = filters;

    const { values, conditions } = prepareWhere( dbFilters);

    // if search is pass in the filter build the specific condition for adherent where clause
    if ( search !== undefined) 
    {
        const index = values.length + 1;

        conditions.push( `(lower(nom) ILIKE lower($${index}) OR lower(prenom) ILIKE lower($${index}))`);
        values.push( `%${filters.search}%`);
    }
    
    const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const result: QueryResult<AdherentResponseDto> = await pool.query<AdherentResponseDto>( 
        `SELECT 
            * 
        FROM 
            ${adherentsSelectViewName} 
            ${whereClause}
        ORDER BY 
            nom,
            prenom`,
        values
    );

    return result.rows;
};


/**
 * Return all adherents
 */
export const findById = async ( 
    id: number
) : Promise<AdherentResponseDto> => 
{
    const result: QueryResult<AdherentResponseDto> = await pool.query<AdherentResponseDto>( 
        `SELECT 
            * 
        FROM 
            ${adherentsSelectViewName} 
        WHERE 
            id = $1`, 
        [id]
    );

    return result.rows[0] || null;
};

/**
* Create a new adherent with a unique adherent number 
*/
export const create = async ( 
    data: CreateAdherentDto
) : Promise<AdherentResponseDto> => 
{
    try
    {
        const numero: string = await genererNumeroAdherent();

        // Retrieve the list of the CreateAdherentDto's fields 
        // Prepare with SQL helper
        const { fields, values, sqlFieldList, sqlQueryValues } = prepareInsert(
            data, 
            {
                numero_adherent: numero, // Extra data not in the json data / req.body but added in model - genererNumeroAdherent();
            }
        );

        const result: QueryResult<AdherentResponseDto> = await pool.query<AdherentResponseDto>( 
            `INSERT INTO 
                ${adherentsTableName} 
                    (${sqlFieldList}) 
            VALUES 
                (${sqlQueryValues}) 
            RETURNING 
                *`,
            values
        );

        return result.rows[0];
    }
    catch (err: any) 
    {
        const type: string = mapDBError( err);

        if ( type === "unique_violation")
            throw new DuplicateAdherentsError();

        throw err; // autres erreurs DB
    }
};


/**
* Met à jour un adherents
*/
export const update = async ( 
    id: number, 
    data:UpdateAdherentDto
): Promise<AdherentResponseDto|null> => 
{
    // Construction dynamique du SET
    const champs: string[] = Object.keys( data);
    const valeurs: (string | number | boolean | null)[] = Object.values(data);

    if ( champs.length === 0) 
        return findById(id);

    const setClause: string = champs.map((c, i) => `${c} = $${i + 1}`).join(', ');
    // Id is last because value is $[index_arg] where the arg is ...champs + id
    const result: QueryResult<AdherentResponseDto> = await pool.query<AdherentResponseDto>(
        `UPDATE 
            ${adherentsTableName} 
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
* Disabled an adherent (soft delete — we are never deleting line in the BDD).
*/
export const desactiver = async ( 
    id: number
) : Promise<AdherentResponseDto> => 
{
    const result: QueryResult<AdherentResponseDto> = await pool.query<AdherentResponseDto>( 
        `UPDATE 
            ${adherentsTableName} 
        SET
            actif = false 
        WHERE 
            id = $1 
        RETURNING 
            *`, 
        [id]
    );

    return result.rows[0] || null;
};


/**
 * Return list of member
 * filter optional
 *
 */
export const getSelectOptionList = async (
    filters: FilterAdherentDto = {}
) : Promise<AdherentResponseDto[]> => 
{
    // remove specific fields not in DB like search - specific condition will be added after the sql builder prepare select
    const { search, ...dbFilters } = filters;

    const { values, conditions } = prepareWhere( dbFilters);

    // if search is pass in the filter build the specific condition for adherent where clause
    if ( search !== undefined) 
    {
        const index = values.length + 1;

        conditions.push( `(lower(nom) ILIKE lower($${index}) OR lower(prenom) ILIKE lower($${index}))`);
        values.push( `%${filters.search}%`);
    }
    
    const whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const result: QueryResult<AdherentResponseDto> = await pool.query<AdherentResponseDto>( 
        `SELECT 
            id as value
            name as 
        FROM 
            ${adherentsTableName} 
            ${whereClause}
        ORDER BY 
            nom,
            prenom`,
        values
    );

    return result.rows;
};

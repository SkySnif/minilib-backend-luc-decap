// backend/src/models/empruntsModel.js
/**
* Accès aux données adhérents via PostgreSQL.
* @module empruntsModel
*/
import type { QueryResult, CountRow} from '@hendec/types/db';

import { mapDBError } from "@hendec/backend/utils";
import { prepareInsert, prepareWhere } from '@hendec/backend/utils';

import pool from '../config/database.js';

// Error manager for specific error to catch associated to livres
import { DuplicateEmpruntsError } from "../errors/empruntsErrors.js";

import type { FilterEmpruntDto, CreateEmpruntDto, UpdateEmpruntDto, ReturnEmpruntDto, EmpruntsResponseDto } from '@hendec/types/minilib';

// ───────────────────────────────────────────────────────────────
// ──── CONST for easier change in DB
// ───────────────────────────────────────────────────────────────
const empruntsTableName: string = "t_emprunts"
const empruntsSelectView: string = "emprunts"

// ───────────────────────────────────────────────────────────────
// ──── Export function ─ exposed to route ───────────────────────
// ───────────────────────────────────────────────────────────────
/**
 * Return list of member
 * filter optional
 *
 */
export const findAll = async (
    filters: FilterEmpruntDto = {}
) : Promise<EmpruntsResponseDto[]> => 
{
    try
    {
        // remove specific fields not in DB like search - specific condition will be added after the sql builder prepare select
        const { search, ...dbFilters } = filters;

        const { values, conditions } = prepareWhere( dbFilters);

        // if search is pass in the filter build the specific condition for emprunt where clause
        if ( search !== undefined) 
        {
            const index = values.length + 1;

            conditions.push( `(lower(nom) ILIKE lower($${index}) OR lower(prenom) ILIKE lower($${index}))`);
            values.push( `%${filters.search}%`);
        }
        
        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const result: QueryResult<EmpruntsResponseDto> = await pool.query<EmpruntsResponseDto>( 
            `SELECT 
                * 
            FROM 
                ${empruntsSelectView} 
                ${whereClause}
            ORDER BY 
                date_emprunt`,
            values
        );

        return result.rows;
    }
    catch (err: any) 
    {
        const type: string = mapDBError( err);

        if ( type === "unique_violation")
            throw new DuplicateEmpruntsError();

        throw err; // autres erreurs DB
    }
};


/**
 * Return all emprunts
 */
export const findById = async ( 
    id: number
) : Promise<EmpruntsResponseDto> => 
{
    try
    {
        const result: QueryResult<EmpruntsResponseDto> = await pool.query<EmpruntsResponseDto>( 
            `SELECT 
                * 
            FROM 
                ${empruntsSelectView} 
            WHERE 
                id = $1`, 
            [id]
        );

        return result.rows[0] || null;
    }
    catch (err: any) 
    {
        const type: string = mapDBError( err);

        if ( type === "unique_violation")
            throw new DuplicateEmpruntsError();

        throw err; // autres erreurs DB
    }
};

export const listIdNameAdherentAlreadyBooked = async ( 
    adherent_id: number
) : Promise<number> => 
{
    try
    {
        const result = await pool.query<{ numberLoan: string }>( 
            `SELECT 
                id,
                nom,
            FROM 
                ${empruntsSelectView} 
            WHERE 
                adherent_id = $1 AND
                date_retour_effective IS NULL
            GROUP BY
                adherent_id`, 
            [adherent_id]
        );

        return Number(result.rows[0]?.numberLoan ?? 0);
    }
    catch (err: any) 
    {
        const type: string = mapDBError( err);

        if ( type === "unique_violation")
            throw new DuplicateEmpruntsError();

        throw err; // autres erreurs DB
    }
};


/**
 * Return all emprunts
 */
export const countAdherentAlreadyBooked = async ( 
    adherent_id: number
) : Promise<number> => 
{
    try
    {
        const result = await pool.query<{ numberLoan: string }>( 
            `SELECT 
                COUNT(1) as "numberLoan"
            FROM 
                ${empruntsSelectView} 
            WHERE 
                adherent_id = $1 AND
                date_retour_effective IS NULL
            GROUP BY
                adherent_id`, 
            [adherent_id]
        );

        return Number(result.rows[0]?.numberLoan ?? 0);
    }
    catch (err: any) 
    {
        const type: string = mapDBError( err);

        if ( type === "unique_violation")
            throw new DuplicateEmpruntsError();

        throw err; // autres erreurs DB
    }
};

/**
* Create a new emprunt with a unique emprunt number 
*/
export const create = async ( 
    data: CreateEmpruntDto
): Promise<EmpruntsResponseDto> => 
{
    try
    {
        // Retrieve the list of the CreateEmpruntDto's fields 
        // Prepare with SQL helper
        const { fields, values, sqlFieldList, sqlQueryValues } = prepareInsert( data);

        const result: QueryResult<EmpruntsResponseDto> = await pool.query<EmpruntsResponseDto>( 
            `INSERT INTO 
                ${empruntsTableName} 
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
            throw new DuplicateEmpruntsError();

        throw err; // autres erreurs DB
    }
};

/**
* Met à jour un emprunts
*/
export const update = async ( 
    id: number, 
    data:UpdateEmpruntDto
): Promise<EmpruntsResponseDto|null> => 
{
    try
    {
        // Construction dynamique du SET
        const champs: string[] = Object.keys( data);
        const valeurs: (Date | string | number | boolean | null)[] = Object.values(data);

        if ( champs.length === 0) 
            return findById(id);

        const setClause: string = champs.map((c, i) => `${c} = $${i + 1}`).join(', ');

        // Id is last because value is $[index_arg] where the arg is ...champs + id
        const result: QueryResult<EmpruntsResponseDto> = await pool.query<EmpruntsResponseDto>(
            `UPDATE 
                ${empruntsTableName} 
            SET 
                ${setClause} 
            WHERE 
                id = $${champs.length + 1}
            RETURNING 
                *`,
            [...valeurs, id]
        );

        return result.rows[0] || null;
    }
    catch (err: any) 
    {
        const type: string = mapDBError( err);

        if ( type === "unique_violation")
            throw new DuplicateEmpruntsError();

        throw err; // autres erreurs DB
    }
};


/**
* Disabled an emprunt (soft delete — we are never deleting line in the BDD).
*/
export const returnBook = async (
    id: number,
    returnParams: ReturnEmpruntDto
) : Promise<EmpruntsResponseDto> => 
{
    try
    {
        const result: QueryResult<EmpruntsResponseDto> = await pool.query<EmpruntsResponseDto>( 
            `UPDATE
                ${empruntsTableName} 
            SET
                date_retour_effective = $2
            WHERE 
                id=$1 AND
                date_retour_effective IS NULL
            RETURNING 
                *`, 
            [id, returnParams.date_retour_effective]
        );

        return result.rows[0] || null;
    }
    catch (err: any) 
    {
        const type: string = mapDBError( err);

        if ( type === "unique_violation")
            throw new DuplicateEmpruntsError();

        throw err; // autres erreurs DB
    }   
};


/**
 * Return list of member
 * filter optional
 *
 */
export const getSelectOptionList = async (
    filters: FilterEmpruntDto = {}
) : Promise<EmpruntsResponseDto[]> => 
{
    try
    {
        // remove specific fields not in DB like search - specific condition will be added after the sql builder prepare select
        const { search, ...dbFilters } = filters;

        const { values, conditions } = prepareWhere( dbFilters);

        // if search is pass in the filter build the specific condition for emprunt where clause
        if ( search !== undefined) 
        {
            const index = values.length + 1;

            conditions.push( `(lower(nom) ILIKE lower($${index}) OR lower(prenom) ILIKE lower($${index}))`);
            values.push( `%${filters.search}%`);
        }
        
        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const result: QueryResult<EmpruntsResponseDto> = await pool.query<EmpruntsResponseDto>( 
            `SELECT 
                id as value
                name as 
            FROM 
                ${empruntsTableName} 
                ${whereClause}
            ORDER BY 
                nom,
                prenom`,
            values
        );

        return result.rows;
    }
    catch (err: any) 
    {
        const type: string = mapDBError( err);

        if ( type === "unique_violation")
            throw new DuplicateEmpruntsError();

        throw err; // autres erreurs DB
    }   
};

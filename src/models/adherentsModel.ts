// backend/src/models/adherentsModel.js
/**
* Accès aux données adhérents via PostgreSQL.
* @module adherentsModel
*/
import type { QueryResult, CountRow} from '@hendec/types/db';

import { mapDBError } from "@hendec/backend/utils";
import { prepareInsert } from '@hendec/backend/utils';

import pool from '../config/database.js';

// Error manager for specific error to catch associated to livres
import { DuplicateAdherentsError } from "../utils/errors/modulesErrors/adherentsErrors.js";

import { createAdherentSchema } from '@hendec/types/minilib';
import type { Adherent, CreateAdherentDto } from '@hendec/types/minilib';

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

/** @async @returns {Promise<Array>} Tous les adhérents actifs */
export const findAll = async ()  : Promise<Adherent[]> => 
{
    const result: QueryResult<Adherent> = await pool.query<Adherent>( 
        `SELECT 
            * 
        FROM 
            adherents 
        WHERE 
            actif = true 
        ORDER BY 
            nom,
            prenom`
    );

    return result.rows;
};

/** @async @param {number} id @returns {Promise<Object|null>} */
export const findById = async ( id: number) => 
{
    const result: QueryResult<Adherent> = await pool.query<Adherent>( 
        `SELECT 
            * 
        FROM 
            adherents 
        WHERE 
            id = $1`, 
        [id]
    );

    return result.rows[0] || null;
};

/**
* Create a new adherent with a unique adherent number 
* @async
* @param {Object} data - { nom, prenom, email }
* @returns {Promise<Object>} Adhérent créé
*/
export const create = async ( data: CreateAdherentDto): Promise<Adherent> => 
{
    try
    {
        // Validate DTO aith Zod
        // Optionnal because it's done in the middleware route but in case if the function is not called from the router/middleware
        const parsedData: CreateAdherentDto = createAdherentSchema.parse(data);

        const numero: string = await genererNumeroAdherent();

        // Retrieve the list of the CreateLivreDto's fields 
        // TODO: Check details of this instruction
        // On filtre les valeurs undefined
        // Préparer SQL avec helper
        const { champs, valeurs, SQLqueryvalue, SQLField } = prepareInsert(parsedData, 
            {
                numero_adherent: numero, // Extra data not in the json data / req.body but added in model - genererNumeroAdherent();
            }
        );

        const result: QueryResult<Adherent> = await pool.query<Adherent>( 
            `INSERT INTO 
                adherents 
                    (${SQLField}) 
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
            throw new DuplicateAdherentsError();

        throw err; // autres erreurs DB
    }
};
/**
* Disabled an adherent (soft delete — we are never deleting line in the BDD).
* @async
* @param {number} id
* @returns {Promise<Object|null>} Adhérent mis à jour
*/
export const desactiver = async ( id: number) : Promise<Adherent> => 
{
    const result: QueryResult<Adherent> = await pool.query<Adherent>( 
        `UPDATE 
            adherents 
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
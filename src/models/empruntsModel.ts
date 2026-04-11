// backend/src/models/empruntModel.js
/**
* Accès aux données adhérents via PostgreSQL.
* @module empruntModel
*/

import type { QueryResult, CountRow} from '@hendec/types/db';

import { mapDBError } from "@hendec/backend/utils";
import { prepareInsert } from '@hendec/backend/utils';

import pool from '../config/database.js';

// Error manager for specific error to catch associated to livres
import { DuplicateEmpruntsError  } from "../utils/errors/modulesErrors/EmpruntsErrors.js";
import type { Emprunt } from "@hendec/types/minilib";


// ───────────────────────────────────────────────────────────────
// ──── Export function ─ exposed to route ───────────────────────
// ───────────────────────────────────────────────────────────────

/** @async @returns {Promise<Array>} Tous les adhérents actifs */
export const findAll = async () : Promise<Emprunt[]>=> 
{
    const result:QueryResult<Emprunt> = await pool.query<Emprunt>( 
        `SELECT 
            * 
        FROM 
            emprunt 
        WHERE 
            actif = true 
        ORDER BY 
            nom, 
            prenom`
    );

    return result.rows;
};

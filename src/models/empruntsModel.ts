// backend/src/models/empruntModel.js
/**
* Accès aux données adhérents via PostgreSQL.
* @module empruntModel
*/

import pool from '../config/database.js';
import type { QueryResult } from '../types/queryResult.js';

// Manage to converte error code by DB in global error code
import { mapDBError } from "../utils/errors/db/dbErrorMapper.js";

// Error manager for specific error to catch associated to livres
import { DuplicateEmpruntsError  } from "../utils/errors/modulesErrors/EmpruntsErrors.js";

// import { Livre, FiltresLivre, CreateLivreDto } from '../types/livre.js';
import type { Emprunt  } from "../validators/empruntShema.js";

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

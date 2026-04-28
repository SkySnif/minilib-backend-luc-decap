// backend/src/models/loginModel.js

/**
* Accès aux données login via PostgreSQL.
* Remplace l'ancien loginData.js en mémoire.
* Toutes les fonctions sont async — elles retournent des Promises.
*
* @module loginModel
*/
import type { QueryResult} from '@hendec/types/db';

import { mapDBError } from "@hendec/backend/utils";

import pool from '../config/database.js';

import type { LoginIdentifyDto, LoginResponseDto } from "@hendec/types/minilib";

// ───────────────────────────────────────────────────────────────
// ──── CONST for easier change in DB
// ───────────────────────────────────────────────────────────────
const loginSelectView: string = "login"

/**
* retrieve all books with optional filters
*/
export const getUser = async ( 
    login: LoginIdentifyDto = {}
) : Promise<LoginResponseDto | null> => 
{
    try
    {
        const result: QueryResult<LoginResponseDto> = await pool.query<LoginResponseDto>(
            `SELECT 
                * 
            FROM 
                ${loginSelectView}
            WHERE 
                user_name=$1`
            ,
            [ login.user_name ]
        );

        return result.rows[0] || null;
    }
    catch (err: any) 
    {
        // Map error code Postgres or other with a custom type
        const type: string = mapDBError( err);
        throw err; // other DB error not customized
    }
};    


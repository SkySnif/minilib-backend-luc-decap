// backend/src/config/database.js
/**
* Pool de connexions PostgreSQL partagé dans toute l'application.
* Chargé via Node 24 : node --env-file=.env src/app.js
* @module database
*/
// environment variable loader - needed for secret files
import { env } from './envConfig.js';
import { createPool } from "@hendec/backend/config";

const pool = createPool(env.db);

// const pool: Pool = new Pool(
//     {
//         host: env.DB_HOST,
//         port: env.DB_PORT,
//         database: env.DB_NAME,
//         user: env.DB_USER,
//         password: env.DB_PASSWORD,
//         max: 10,
//         idleTimeoutMillis: 30000,
//     }
// );

// pool.on('connect', () => console.log( '[DB] Pool PostgreSQL connecté'));
// pool.on('error', (err: Error) => console.error( '[DB] Erreur pool:', err.message,  err.stack));

export default pool;
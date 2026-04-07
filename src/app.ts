// ─── backend/src/app.js ─────────────────────────────────────────────
// Entry Point of MiniLib Express server
// Start with : npm run dev

// environment variable loader - needed for secret files
import { env } from './config/env.js';

import express from 'express';
import type { Request, Response, NextFunction, Application} from 'express';

//import express from 'express';
import cors from 'cors';
// Node 20+ : no need .dotenv // charge les variables depuis .env

// Error handler
import errorHandler from "./middleware/errorHandler.js";

// Router Import
import livresRouter from './routes/livres.js';
import adherentsRouter from './routes/adherent.js';

// ── Initialisation of Express' application  ──────────────────────────
const app: Application = express();
const PORT: number|string = env.PORT || 5000;

// ── Middlewares globaux ───────────────────────────────────────────────
// cors() : autorise les requêtes cross-origin (React sur port 3000 → APIsur 5000)
app.use( cors());

// express.json() : parse automatiquement le body JSON des requêtes POST / PUT
app.use( express.json());

// Middleware de logging minimaliste — affiche chaque requête reçue
app.use( ( req: Request, res: Response, next: NextFunction) => 
    {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next(); // next() = passer au middleware/route suivant
    }
);

// ── Routes ───────────────────────────────────────────────────────────
// All livres's route are prefixe by  /api/v1/livres
app.use( '/api/v1/livres', livresRouter);

// All adherents' route are prefixe by  /api/v1/adherents
app.use( '/api/v1/adherents', adherentsRouter);

// All emprunt's route are prefixe by  /api/v1/emprunt
// app.use( '/api/v1/emprunts', empruntsRouter);

// health route — Check if server is running
app.get( '/health', ( req: Request, res: Response) => 
    {
        res.json(
            {
                status: 'OK',
                message: 'MiniLib Server up',
                timestamp: new Date().toISOString(),
            }
        );
    }
);

// // Middleware to manage unknow route (404)
// app.use( ( req: Request, res: Response) => 
//     {
//         res.status(404).json(
//             {
//                 erreur: `Route ${req.method} ${req.url} not find`,
//             }
//         );
//     }
// );

// Middleware de gestion des erreurs serveur (500)
// Express reconnaît ce middleware à ses 4 paramètres (err en premier)
// Error handler always the last one
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────
app.listen( PORT, (): void => 
    {
        console.log(`MiniLib server started on http://localhost:${PORT}`);
        console.log(`Environment : ${process.env.NODE_ENV}`);
    }
);

export default app; // export pour les tests futurs
// ─── backend/src/routes/livres.js ──────────────────────────────────────
// Routeur Express pour les livres
// Toutes ces routes sont préfixées par /api/v1/livres dans app.js
import express, { Router } from 'express';

import { asyncWrapper, validateResponse } from '@hendec/backend/middleware';
import { validateBody, validateQuery, validateParams } from '@hendec/backend/middleware';

import { paramIdSchema } from '@hendec/types/param';
import { createLivreSchema, filtreLivreSchema, updateLivreSchema, deleteLivreSchema, livresResponseSchema, livreResponseSchema  } from "@hendec/types/minilib";

import * as controller from '../controllers/livresController.js';

const router: Router = express.Router();

// GET /api/v1/livres → liste tous les livres (+ filtres query params)
router.get( '/', validateQuery( filtreLivreSchema), validateResponse( livresResponseSchema), asyncWrapper( controller.getLivres));

// GET /api/v1/livres/:id → détail d'un livre
router.get( '/:id', validateParams( paramIdSchema), validateResponse( livreResponseSchema), asyncWrapper( controller.getLivreById));

// POST /api/v1/livres → créer un nouveau livre
router.post( '/', validateBody(createLivreSchema), validateResponse( livreResponseSchema), asyncWrapper( controller.createLivre));

// PUT /api/v1/livres/:id → modifier un livre
router.put( '/:id', validateParams( paramIdSchema), validateBody( updateLivreSchema), validateResponse( livreResponseSchema), asyncWrapper( controller.updateLivre));

// DELETE /api/v1/livres/:id → supprimer un livre
router.delete( '/:id', validateParams( paramIdSchema), validateParams( deleteLivreSchema), asyncWrapper( controller.deleteLivre));

export default router;
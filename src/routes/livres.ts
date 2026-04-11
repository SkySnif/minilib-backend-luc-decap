// ─── backend/src/routes/livres.js ──────────────────────────────────────
// Routeur Express pour les livres
// Toutes ces routes sont préfixées par /api/v1/livres dans app.js
import express, { Router } from 'express';
import asyncWrapper from '../middleware/asyncWrapper.js';
import validate from '../middleware/validate.js';

import { createLivreSchema } from "@hendec/types/minilib";
import * as controller from '../controllers/livresController.js';

const router: Router = express.Router();

// GET /api/v1/livres → liste tous les livres (+ filtres query params)
router.get( '/', asyncWrapper( controller.getLivres));

// GET /api/v1/livres/:id → détail d'un livre
router.get( '/:id', asyncWrapper( controller.getLivreById));

// POST /api/v1/livres → créer un nouveau livre
router.post( '/', validate(createLivreSchema), asyncWrapper( controller.createLivre));

// PUT /api/v1/livres/:id → modifier un livre
router.put( '/:id', asyncWrapper( controller.updateLivre));

// DELETE /api/v1/livres/:id → supprimer un livre
router.delete( '/:id', asyncWrapper( controller.deleteLivre));

export default router;
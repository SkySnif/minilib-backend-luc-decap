// backend/src/routes/emprunt.js
import express, { Router } from 'express';
import asyncWrapper from '../middleware/asyncWrapper.js';
import validate from '../middleware/validate.js';

import { createEmpruntSchema } from '../validators/empruntShema.js';
import * as controller from '../controllers/empruntsController.js';

const router: Router = express.Router();

// router.get( '/', asyncWrapper( controller.getEmprunt));
// router.get( '/:id', asyncWrapper( controller.getAdherentById));
// router.post( '/', asyncWrapper( controller.createAdherent));
// router.delete( '/:id', asyncWrapper( controller.desactiverAdherent));

export default router;
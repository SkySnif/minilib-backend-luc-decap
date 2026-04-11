// backend/src/routes/adherents.js
import express, { Router } from 'express';
import asyncWrapper from '../middleware/asyncWrapper.js';
import validate from '../middleware/validate.js';

import { createAdherentSchema } from '@hendec/types/minilib';
import * as controller from '../controllers/adherentsController.js';

const router: Router = express.Router();

router.get( '/', asyncWrapper( controller.getAdherents));
router.get( '/:id', validate(createAdherentSchema), asyncWrapper( controller.getAdherentById));
router.post( '/', asyncWrapper( controller.createAdherent));
router.delete( '/:id', asyncWrapper( controller.desactiverAdherent));

export default router;
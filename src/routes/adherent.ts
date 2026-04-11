// backend/src/routes/adherents.js
import express, { Router } from 'express';

import { asyncWrapper } from '@hendec/backend/middleware';
import { validate } from '@hendec/backend/middleware';

import { createAdherentSchema } from '@hendec/types/minilib';
import * as controller from '../controllers/adherentsController.js';

const router: Router = express.Router();

router.get( '/', asyncWrapper( controller.getAdherents));
router.get( '/:id', validate(createAdherentSchema), asyncWrapper( controller.getAdherentById));
router.post( '/', asyncWrapper( controller.createAdherent));
router.delete( '/:id', asyncWrapper( controller.desactiverAdherent));

export default router;
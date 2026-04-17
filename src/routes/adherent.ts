// backend/src/routes/adherents.js
import express, { Router } from 'express';

import { asyncWrapper } from '@hendec/backend/middleware';
import { validate } from '@hendec/backend/middleware';

import { createAdherentSchema, updateAdherentSchema, deleteAdherentSchema, adherentSchema } from '@hendec/types/minilib';

import * as controller from '../controllers/adherentsController.js';

const router: Router = express.Router();

router.get( '/',  asyncWrapper( controller.getAdherents));
router.get( '/:id', validate(adherentSchema), asyncWrapper( controller.getAdherentById));
router.post( '/', validate(createAdherentSchema), asyncWrapper( controller.createAdherent));
router.put( '/:id', validate(updateAdherentSchema) ,asyncWrapper( controller.updateAdherent));
router.delete( '/:id', validate(deleteAdherentSchema), asyncWrapper( controller.desactiverAdherent));

export default router;
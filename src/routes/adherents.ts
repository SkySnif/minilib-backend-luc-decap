// backend/src/routes/adherents.js
import express, { Router } from 'express';

import { asyncWrapper } from '@hendec/backend/middleware';
import { validateBody, validateQuery, validateParams, validateResponse } from '@hendec/backend/middleware';

import { paramIdSchema } from '@hendec/types/param';
import { adherentResponseSchema, createAdherentSchema, filterAdherentSchema, updateAdherentSchema, deleteAdherentSchema, adherentsResponseSchema } from '@hendec/types/minilib';

import * as controller from '../controllers/adherentsController.js';

const router: Router = express.Router();

router.get( '/',  validateQuery( filterAdherentSchema), validateResponse( adherentsResponseSchema), asyncWrapper( controller.getAdherents));
router.get( '/:id', validateParams( paramIdSchema), validateResponse( adherentResponseSchema), asyncWrapper( controller.getAdherentById));
router.post( '/', validateBody( createAdherentSchema), validateResponse( adherentResponseSchema), asyncWrapper( controller.createAdherent));
router.put( '/:id', validateParams( paramIdSchema), validateBody( updateAdherentSchema) , validateResponse( adherentResponseSchema), asyncWrapper( controller.updateAdherent));
router.delete( '/:id', validateParams( paramIdSchema), validateParams( deleteAdherentSchema), asyncWrapper( controller.desactiverAdherent));

export default router;
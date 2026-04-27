// backend/src/routes/emprunt.js
import express, { Router } from 'express';

import { asyncWrapper } from '@hendec/backend/middleware';
import { validateBody, validateQuery, validateParams, validateResponse } from '@hendec/backend/middleware';

import { paramIdSchema } from '@hendec/types/param';
import { empruntSchema, createEmpruntSchema, empruntResponseSchema, EmpruntsResponseSchema, filterEmpruntSchema, returnEmpruntSchema, updateEmpruntSchema } from '@hendec/types/minilib';
import * as controller from '../controllers/empruntsController.js';

const router: Router = express.Router();

router.get( '/',  validateQuery( filterEmpruntSchema), validateResponse( EmpruntsResponseSchema), asyncWrapper( controller.getEmprunts));
router.get( '/:id', validateParams( paramIdSchema), validateResponse( empruntResponseSchema), asyncWrapper( controller.getEmpruntById));
router.post( '/', validateBody( createEmpruntSchema), validateResponse( empruntResponseSchema), asyncWrapper( controller.createEmprunt));
router.put( '/:id', validateParams( paramIdSchema), validateBody( updateEmpruntSchema) , validateResponse( empruntResponseSchema), asyncWrapper( controller.updateEmprunt));
router.delete( '/:id', validateParams( paramIdSchema), validateBody( returnEmpruntSchema), asyncWrapper( controller.deleteEmprunt));

export default router;
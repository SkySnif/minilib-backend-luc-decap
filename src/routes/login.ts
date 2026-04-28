// ─── backend/src/routes/login.js ──────────────────────────────────────
// Routeur Express pour les login
// Toutes ces routes sont préfixées par /api/v1/login dans app.js
import express, { Router } from 'express';

import { asyncWrapper,  } from '@hendec/backend/middleware';
import { validateBody, validateResponse } from '@hendec/backend/middleware';

import { loginIdentifySchema, loginResponseSchema  } from "@hendec/types/minilib";

import * as controller from '../controllers/loginController.js';

const router: Router = express.Router();

// GET /api/v1/login → liste tous les login (+ filtres query params)
router.post( '/', validateBody( loginIdentifySchema), validateResponse( loginResponseSchema), asyncWrapper( controller.identify));

export default router;
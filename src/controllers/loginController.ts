// ─── backend/src/controllers/loginsController.js ──────────────────────
// Controller pour les logins — logique métier entre les routes et les données

import type { Request, Response } from 'express';

import { NotFoundError } from "@hendec/backend/utils";
import { getValidated } from '@hendec/backend';

import type { LoginIdentifyDto, LoginResponseDto } from "@hendec/types/minilib";

import * as loginsModel from '../models/loginModel.js';

/**
* 
*/
export const identify = async( 
    req: Request,
    res: Response
) : Promise<void> => 
{
        const login: LoginResponseDto = getValidated<LoginIdentifyDto>(req.validated?.body);

        // req.query contient les paramètres de l'URL (?genre=...&disponible=...)
        const logins: LoginResponseDto = await loginsModel.getUser( login);

        if (!logins)
            throw new NotFoundError( "User")

        res.json( logins);
};

import { z } from "zod";

/**
 * Schema pour créer un adherent (input)
 */
export const createAdherentSchema = z.object(
    {
        nom: z.string().min(1).describe("Nom de l'adherent"),
        prenom: z.string().min(1).describe("Prénom de l'adherent"),
        email: z.email().describe("Adresse email"),
    }
);

/**
 * Schema pour un adherent complet (DB + API)
 */
export const adherentResponseSchema = z.object(
    {
        id: z.number().describe("ID unique"),
        numero_adherent: z.string().describe("Numéro adhérent unique"),
        nom: z.string().describe("Nom de l'adherent"),
        prenom: z.string().describe("Prénom de l'adherent"),
        email: z.email().describe("Adresse email"),
        actif: z.boolean().describe("Statut actif"),
        created_at: z.date().describe("Date de création"),
    }
);

export type Adherent = z.infer<typeof adherentResponseSchema>;
export type CreateAdherentDto = z.infer<typeof createAdherentSchema>;

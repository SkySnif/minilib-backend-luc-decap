import { z } from "zod";

/**
 * Schema pour créer un emprunt (input)
 */
export const createEmpruntSchema = z.object(
    {
        livre_id: z.number().int().positive().describe("ID du livre emprunté"),
        adherent_id: z.number().int().positive().describe("ID de l'adherent"),
    }
);


/**
 * Schema pour un emprunt complet (DB)
 */
export const empruntResponseSchema = z.object(
    {
        id: z.number().describe("ID unique de l'emprunt"),
        livre_id: z.number().describe("ID du livre emprunté"),
        adherent_id: z.number().describe("ID de l'adherent"),
        date_emprunt: z.date().describe("Date d'emprunt"),
        date_retour_prevue: z.date().describe("Date prévue de retour"),
        date_retour_effective: z.date().nullable().describe("Date effective de retour, null si non rendu"),
    }
);


/**
 * Schema pour un emprunt enrichi avec détails JOIN
 */
export const empruntAvecDetailsSchema = empruntResponseSchema.extend(
    {
        titre_livre: z.string().describe("Titre du livre"),
        nom_adherent: z.string().describe("Nom complet de l'adherent"),
        en_retard: z.boolean().describe("Indique si l'emprunt est en retard"),
    }
);


export type CreateEmpruntDto = z.infer<typeof createEmpruntSchema>;
export type Emprunt = z.infer<typeof empruntResponseSchema>;
export type EmpruntAvecDetails = z.infer<typeof empruntAvecDetailsSchema>;

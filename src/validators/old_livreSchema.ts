import { z } from "zod";

export const livreResponseSchema = z.object(
    {
        id: z.number(),
        isbn: z.string(),
        titre: z.string(),
        auteur: z.string(),
        annee: z.number().nullable(),
        genre: z.string().nullable(),
        disponible: z.boolean(),
    }
);


export const createLivreSchema = z.object(
    {
        isbn: z.string().min(10).max(13).describe("ISBN du livre"),
        titre: z.string().min(1).describe("Titre du livre"),
        auteur: z.string().min(1).describe("Auteur"),
        annee: z.number().optional().describe("Année de publication"),
        genre: z.string().optional().describe("Genre du livre"),
    }
);

export const filtreLivreSchema = z.object(
    {
        genre: z.string().optional(),
        disponible: z.boolean().optional(),
        recherche: z.string().optional(),
    }
);

export type FiltresLivre = z.infer<typeof filtreLivreSchema>;
export type CreateLivreDto = z.infer<typeof createLivreSchema>;
export type Livre = z.infer<typeof livreResponseSchema>;

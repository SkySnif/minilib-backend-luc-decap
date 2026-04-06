// backend/src/types/emprunt.ts


/**
* Représente un emprunt dans le catalogue MiniLib.
* Correspond à la table emprunts dans PostgreSQL.
**/
export interface Emprunt 
{
    id: number;
    livre_id: number;
    adherent_id: number;
    date_emprunt: Date;
    date_retour_prevue: Date;
    date_retour_effective: Date | null;
}

/**
* Interface enrichie avec les données des JOINs SQL
*/
export interface EmpruntAvecDetails extends Emprunt {
    titre_livre: string;
    nom_adherent: string;
    en_retard: boolean;
}

/**
* Data to create an emprunt
*/
export interface CreateEmpruntDto 
{
    livre_id: number;
    adherent_id: number;
}
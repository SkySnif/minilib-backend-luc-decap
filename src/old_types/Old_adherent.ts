// backend/src/types/adherent.ts

/**
* Représente un adherent dans le catalogue MiniLib.
* Correspond à la table adherents dans PostgreSQL.
**/
export interface Adherent 
{
    id: number;
    numero_adherent: string;
    nom: string;
    prenom: string;
    email: string;
    actif: boolean;
    created_at: Date;
}

/**
* Données pour créer un adherent — sans id (SERIAL PostgreSQL)
* */
export interface CreateAdherentDto 
{
    nom: string;
    prenom: string;
    email: string;
}

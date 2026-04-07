-- Table livres
CREATE TABLE IF NOT EXISTS livres
(
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    annee INTEGER CHECK (
        annee > 0
        AND annee <= EXTRACT(
            YEAR
            FROM
                NOW()
        )
    ),
    genre VARCHAR(100),
    disponible BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_livres_titre ON livres(titre);

CREATE INDEX IF NOT EXISTS idx_livres_auteur ON livres(auteur);


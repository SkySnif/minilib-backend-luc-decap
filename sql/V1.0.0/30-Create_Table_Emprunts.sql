-- Table emprunts
CREATE TABLE IF NOT EXISTS emprunts 
(
    id SERIAL PRIMARY KEY,
    livre_id INTEGER NOT NULL REFERENCES livres(id),
    adherent_id INTEGER NOT NULL REFERENCES adherents(id),
    date_emprunt DATE NOT NULL DEFAULT CURRENT_DATE,
    date_retour_prevue DATE NOT NULL,
    date_retour_effective DATE,
    -- NULL = pas encore rendu
    CONSTRAINT chk_dates CHECK (date_retour_prevue >= date_emprunt)
);

CREATE INDEX IF NOT EXISTS idx_emprunts_actifs ON emprunts(adherent_id)
WHERE
    date_retour_effective IS NULL;
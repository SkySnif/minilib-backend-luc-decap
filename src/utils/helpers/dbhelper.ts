/**
 * Helper générique pour préparer insert SQL
 */
export function prepareInsert<T extends Record<string, any>>(
    data: T,
    extra: Record<string, any> = {}
) {
    // On filtre les valeurs undefined
    const entries = Object.entries(data)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k as keyof T, v] as const);

    const champs = [...Object.keys(extra), ...entries.map(([k]) => k)];
    const valeurs = [...Object.values(extra), ...entries.map(([_, v]) => v)];

    const SQLqueryvalue = champs.map((_, i) => `$${i + 1}`).join(", ");
    const SQLField = champs.join(", ");

    return { champs, valeurs, SQLqueryvalue, SQLField };
}

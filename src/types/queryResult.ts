// src/types/queryResult.ts
export interface QueryResult<T> {
    rows: T[];
    rowCount?: number | null;  // added Null for Pg compatibility : pg.QueryResult.rowCount = number | null
    command?: string;       // optionnel
    [key: string]: any;     // extensible pour d’autres DB
}

export interface CountRow {
    count: string;
}

// utils/sql/sqlBuilder.ts

export function prepareInsert<T extends Record<string, any>>(
  data: T,
  extra: Record<string, any> = {}
) {
  const entries = Object.entries(data).filter(([, v]) => v !== undefined);

  const columns = [
    ...Object.keys(extra),
    ...entries.map(([k]) => k),
  ];

  const values = [
    ...Object.values(extra),
    ...entries.map(([, v]) => v),
  ];

  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
  const columnList = columns.map((c) => `"${c}"`).join(", ");

  return { columns, values, placeholders, columnList };
}

export function prepareUpdate<T extends Record<string, any>>(
  data: T,
  extra: Record<string, any> = {},
  offset = 0
) {
  const entries = Object.entries(data).filter(([, v]) => v !== undefined);

  const columns = [...Object.keys(extra), ...entries.map(([k]) => k)];
  const values = [...Object.values(extra), ...entries.map(([, v]) => v)];

  const setClauses = columns.map((col, i) => `"${col}" = $${i + 1 + offset}`).join(", ");

  return { setClauses, values };
}

export function prepareDelete(whereClause: string, values: any[] = []) {
  return { whereClause, values };
}
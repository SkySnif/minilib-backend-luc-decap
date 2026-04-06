// utils/sql/queryHelpers.ts


/**
 * Description placeholder
 *
 * @export
 * @param {Record<string, any>} conditions 
 * @param {number} [offset=0] 
 * @returns {{ clause: any; values: any; }} 
 */
export function buildWhere(
  conditions: Record<string, any>,
  offset = 0
) {
  const keys = Object.keys(conditions);
  const values = Object.values(conditions);

  if (keys.length === 0) return { clause: "", values: [] };

  const clause = keys
    .map((key, i) => `"${key}" = $${i + 1 + offset}`)
    .join(" AND ");

  return { clause, values };
}

export function buildOrderBy(order: Record<string, "ASC" | "DESC">) {
  const keys = Object.keys(order);
  if (keys.length === 0) return "";

  return "ORDER BY " + keys.map((k) => `"${k}" ${order[k]}`).join(", ");
}

export function buildLimitOffset(limit?: number, offset?: number) {
  let clause = "";
  if (limit !== undefined) clause += `LIMIT ${limit} `;
  if (offset !== undefined) clause += `OFFSET ${offset}`;
  return clause.trim();
}
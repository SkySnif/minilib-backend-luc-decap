// config/env.ts
import fs from "fs";

/**
 * load environment file
 * *_FILE will be interpreted as variable without _FILE and set with value in the file 
 * DB_PASSWORD will try to read DB_PASSWORD_FILE variable if not DB_PASSWORD 
 *
 * @param {string} p_VariableName 
 * @param {boolean} [p_IsRequired=true] 
 * @returns {string} 
 */
function load(
  p_VariableName: string, 
  p_IsRequired = true
): string 
{
  const v_Returnvalue =
    process.env[p_VariableName] ?? (process.env[`${p_VariableName}_FILE`]
        ? fs.readFileSync(process.env[`${p_VariableName}_FILE`]!, "utf-8").trim()
        : undefined);

  if ( !v_Returnvalue && p_IsRequired)
    throw new Error(`Missing env: ${p_VariableName}`);

  return v_Returnvalue!;
}

export const env = 
{
  PORT: Number( load( "PORT")),
  NODE_ENV: load( "NODE_ENV", false),

  DB_HOST: load( "DB_HOST"),
  DB_PORT: Number( load( "DB_PORT")),
  DB_USER: load( "DB_USER"),
  DB_PASSWORD: load( "DB_PASSWORD"),
  DB_NAME: load( "DB_NAME"),
};

import { load } from "@hendec/backend/config";

export const env = 
{
  PORT: Number( load( "PORT")),
  NODE_ENV: load( "NODE_ENV", false),
  MAIN_HTTP_ROUTE: load( "MAIN_HTTP_ROUTE"),
  
  db: {
    host: load("DB_HOST"),
    port: Number(load("DB_PORT")),
    user: load("DB_USER"),
    password: load("DB_PASSWORD"),
    database: load("DB_NAME"),
    max: 10,
    idleTimeoutMillis: 30000,
  },
};

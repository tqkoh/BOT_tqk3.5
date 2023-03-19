import * as mariadb from "mariadb";

export const pool = mariadb.createPool({
  host: process.env.MARIADB_HOSTNAME,
  user: process.env.MARIADB_USERNAME,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  connectionLimit: 2, // 5
});

export interface Channel {
  id: string;
  frequency: number;
  channel_id: string;
}

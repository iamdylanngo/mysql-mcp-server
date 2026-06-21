import mysql, { ResultSetHeader, RowDataPacket, ExecuteValues, Pool, PoolOptions } from "mysql2/promise";
import { dbConfig } from "./config.js";

var pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const options: PoolOptions = {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      connectionLimit: dbConfig.connectionLimit,
      waitForConnections: true,
      queueLimit: 0,
    };
    pool = mysql.createPool(options);
  }
  return pool;
}

export async function query<T extends RowDataPacket[]>(
  sql: string,
  params: ExecuteValues): Promise<T> {
  const [rows] = await getPool().query<T>(sql, params);
  return rows;
}

export async function execute(
  sql: string,
  params: ExecuteValues
): Promise<ResultSetHeader> {
  const [result] = await getPool().execute<ResultSetHeader>(sql, params);
  return result;
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
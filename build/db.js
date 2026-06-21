import mysql from "mysql2/promise";
import { dbConfig } from "./config.js";
var pool = null;
export function getPool() {
    if (!pool) {
        const options = {
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
export async function query(sql, params) {
    const [rows] = await getPool().query(sql, params);
    return rows;
}
export async function execute(sql, params) {
    const [result] = await getPool().execute(sql, params);
    return result;
}
export async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
//# sourceMappingURL=db.js.map
import { ResultSetHeader, RowDataPacket, ExecuteValues, Pool } from "mysql2/promise";
export declare function getPool(): Pool;
export declare function query<T extends RowDataPacket[]>(sql: string, params: ExecuteValues): Promise<T>;
export declare function execute(sql: string, params: ExecuteValues): Promise<ResultSetHeader>;
export declare function closePool(): Promise<void>;
//# sourceMappingURL=db.d.ts.map
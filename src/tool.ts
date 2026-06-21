import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { execute, query } from "./db.js";
import { z } from "zod/v4";
import { ExecuteValues, RowDataPacket } from "mysql2/promise";

function isSelect(sql: string): boolean {
  return /^\s*select\b/i.test(sql.trim());
}

export function registerTools(server: McpServer) {

     server.registerTool(
          "select_mysql_version",
          {
               description: "MySQL version."
          },
          async () => {
               const rows = await query<RowDataPacket[]>("SELECT VERSION() AS version", "");
               return {
                    content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
               };
          }
     );

     server.registerTool(
          "list_tables",
          {
               description: "Listing all table, that connected to the database."
          },
          async () => {
               var rows = await query<RowDataPacket[]>("SHOW TABLES;", "");
               return {
                    content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
               };
          }
     )

     server.registerTool(
          "discribe_table",
          {
               description: "Show columns, types, and constraints for a table.",
               inputSchema: z.object({ tableName: z.string() })
          },
          async ({ tableName }) => {
               var rows = await query<RowDataPacket[]>("DESCRIBE ??", [tableName]);
               return {
                    content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
               };
          }
     )

     server.registerTool(
          "query",
          {
               description: "Run a read-only SELECT query with optional params (? placeholders).",
               inputSchema: z.object({ sql: z.string(), params: z.array(z.unknown()).optional() })
          },
          async ({ sql, params }) => {
               const paramsExcuteValues = (params ?? []) as ExecuteValues;
               const rows = await query<RowDataPacket[]>(sql, paramsExcuteValues);
               return {
                    content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
               };
          }
     );

     server.registerTool(
          "mutate",
          {
               description: "Run an INSERT, UPDATE, or DELETE statement with optional params",
               inputSchema: z.object({ sql: z.string(), params: z.array(z.unknown()).optional() })
          },
          async ({ sql, params }) => {
               if (isSelect(sql)) {
                    return {
                         content: [{ type: "text", text: "Use the 'select' tool for SELECT queries." }],
                         isError: true
                    };
               }
               const paramsExcuteValues = (params ?? []) as ExecuteValues;
               const rows = await execute(sql, paramsExcuteValues);
               return {
                    content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
               };
          }
     );

}


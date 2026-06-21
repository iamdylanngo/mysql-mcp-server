import { execute, query } from "./db.js";
import { z } from "zod/v4";
function isSelect(sql) {
    return /^\s*select\b/i.test(sql.trim());
}
export function registerTools(server) {
    server.registerTool("select_mysql_version", {
        description: "MySQL version."
    }, async () => {
        const rows = await query("SELECT VERSION() AS version", "");
        return {
            content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
        };
    });
    server.registerTool("list_tables", {
        description: "Listing all table, that connected to the database."
    }, async () => {
        var rows = await query("SHOW TABLES;", "");
        return {
            content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
        };
    });
    server.registerTool("describe_table", {
        description: "Show columns, types, and constraints for a table.",
        inputSchema: z.object({ tableName: z.string() })
    }, async ({ tableName }) => {
        var rows = await query("DESCRIBE ??", [tableName]);
        return {
            content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
        };
    });
    server.registerTool("query", {
        description: "Run a read-only SELECT query with optional params (? placeholders).",
        inputSchema: z.object({ sql: z.string(), params: z.array(z.unknown()).optional() })
    }, async ({ sql, params }) => {
        const paramsExcuteValues = (params ?? []);
        const rows = await query(sql, paramsExcuteValues);
        return {
            content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
        };
    });
    server.registerTool("mutate", {
        description: "Run an INSERT, UPDATE, or DELETE statement with optional params",
        inputSchema: z.object({ sql: z.string(), params: z.array(z.unknown()).optional() })
    }, async ({ sql, params }) => {
        if (isSelect(sql)) {
            return {
                content: [{ type: "text", text: "Use the 'select' tool for SELECT queries." }],
                isError: true
            };
        }
        const paramsExcuteValues = (params ?? []);
        const rows = await execute(sql, paramsExcuteValues);
        return {
            content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
        };
    });
}
//# sourceMappingURL=tool.js.map
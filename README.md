# MySQL MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that connects Claude (or any MCP-compatible client) to a MySQL database. It exposes tools for schema inspection and running read/write queries over a stdio transport.

## Tools

| Tool | Description |
|------|-------------|
| `select_mysql_version` | Returns the connected MySQL server version |
| `list_tables` | Lists all tables in the connected database |
| `describe_table` | Shows columns, types, and constraints for a given table |
| `query` | Runs a read-only `SELECT` query with optional `?` placeholder params |
| `mutate` | Runs an `INSERT`, `UPDATE`, or `DELETE` statement with optional params |

> **Note:** `mutate` rejects `SELECT` statements — use `query` for reads.

## Requirements

- Node.js 18+
- A running MySQL instance

## Quick Install (Recommended)

### 1. Download the plugin

Go to the [Releases](https://github.com/iamdylanngo/mysql-mcp-server/releases) page and download the latest `.mcpb` file (e.g. `mysql-mcp-server-v1.0.1.mcpb`).

### 2. Install the plugin

**Via Claude Code CLI:**

```bash
claude plugin install mysql-mcp-server-v1.0.1.mcpb
```

**Via Claude Desktop:**

Double-click the `.mcpb` file — Claude Desktop will prompt you to install it.

### 3. Configure your database connection

After installation, Claude will prompt you to fill in your connection details:

| Field | Default | Description |
|-------|---------|-------------|
| Database Host | `127.0.0.1` | MySQL hostname or IP |
| Database Port | `3306` | MySQL port |
| Database User | `root` | MySQL username |
| Database Password | _(empty)_ | MySQL password |
| Database Name | _(required)_ | Database to connect to |
| Connection Pool Limit | `10` | Max concurrent connections |

You can update these settings at any time in Claude's plugin settings under **MySQL MCP Server**.

---

## Manual Setup (from source)

**1. Clone and install dependencies**

```bash
git clone https://github.com/iamdylanngo/mysql-mcp-server
cd mcp
npm install
```

**2. Configure environment**

Copy the sample env file and fill in your database credentials:

```bash
cp .env.sample .env
```

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=mydb
DB_POOL_LIMIT=10
```

**3. Build**

```bash
npm run build
```

## Usage

### Run directly

```bash
node --env-file=.env build/index.js
```

### Inspect with MCP Inspector

```bash
npm run mcp
```

### Connect to Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mysql": {
      "command": "node",
      "args": ["/[absolute-path]/mysql-mcp-server/build/index.js"],
      "env": {
        "DB_HOST": "127.0.0.1",
        "DB_PORT": "3306",
        "DB_USER": "root",
        "DB_PASSWORD": "your_password",
        "DB_NAME": "your_database",
        "DB_POOL_LIMIT": "10"
      }
    }
  }
}
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | MySQL user |
| `DB_PASSWORD` | _(empty)_ | MySQL password |
| `DB_NAME` | `mydb` | Database name |
| `DB_POOL_LIMIT` | `10` | Connection pool size |

## Tech Stack

- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk) — MCP server framework
- [mysql2](https://github.com/sidorares/node-mysql2) — MySQL client with promise support
- [Zod](https://zod.dev/) — Input schema validation
- TypeScript

## License

[MIT](./LICENSE)

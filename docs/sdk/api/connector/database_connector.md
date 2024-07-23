# database_connector

---

**Module**: `prometheux_chain.connector.database_connector`

## Functions

```python
connect_from_yaml(file_path)
```

Connects to databases specified in the YAML configuration file.

- Supports connections to multiple database types, including but not limited to PostgreSQL, Neo4j, CSV, and Parquet.
- Connection is performed without any data migration.
- If a database with the specified alias already exists, the new database is not connected.

**Parameters:**

- `file_path` (str): Path to the YAML file containing database connection details.

**YAML Schema:**

```yml title="databases.yaml"
databases:
  - alias: "ownerships dataset"
    database: "ownerships.csv"
    database_type: "csv"
    username: "***"
    password: "***"
    host: "/my_folder"
    port: "8080"
  - alias: "sample postgresql"
    database_type: "postgres"
    database: "database"
    username: "user"
    password: "password"
    host: "database.myhost.com"
    port: "5432"

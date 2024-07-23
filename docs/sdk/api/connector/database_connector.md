# database_connector

---

**Module**: `prometheux_chain.connector.database_connector`

## Functions

`connect_from_yaml(file_path)`
: Connect to the databases defined in the yaml file.

The yaml file should have the following schema:

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
```

# DatabaseInfo

---

**Module**: `prometheux_chain.model.DatabaseInfo`

## Classes

```python
class DatabaseInfo(id,
                   alias,
                   database,
                   username,
                   password,
                   host,
                   port,
                   database_type,
                   connection_status=None)
```

Represents information about a database, including its connection details and status.

### Attributes

- **id**: The unique identifier for the database.
- **alias**: The alias for the database.
- **database**: The name of the database.
- **username**: The username for connecting to the database.
- **password**: The password for connecting to the database.
- **host**: The host address of the database.
- **port**: The port number for connecting to the database.
- **databaseType**: The type of the database.
- **connectionStatus**: The connection status of the database (optional).

### Methods

    `from_dict(data)`
    : Creates a DatabaseInfo instance from a dictionary.

    `to_dict(self)`
    : Converts the object to a dictionary suitable for JSON serialization.

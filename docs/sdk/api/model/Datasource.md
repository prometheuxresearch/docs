# Datasource

---

**Module**: `prometheux_chain.model.Datasource`

## Classes

```python
class Datasource(id=None,
                 name='',
                 column_names=None,
                 json_schema='',
                 database_info_id=None)
```

Represents a data source, including its name, column names, JSON schema, and associated database id.

### Attributes

- **id**: The unique identifier for the data source (optional).
- **name**: The name of the data source.
- **column_names**: A list of column names in the data source.
- **json_schema**: The JSON schema of the data source.
- **database_info_id**: The ID of the associated `DatabaseInfo` instance (optional).

### Methods

    `get_database_info_id(self)`
    : Returns the database info ID associated with the data source.

    `from_dict(data)`
    : Creates a Datasource object from a dictionary.

    `to_dict(self)`
    :   Converts the object to a dictionary suitable for JSON serialization.

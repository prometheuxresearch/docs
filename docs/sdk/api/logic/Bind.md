# Bind

---

**Module**: `prometheux_chain.logic.Bind`

## Classes

```python
class Bind(id: String,
           predicate_name,
           bind_annotation,
           datasource: Datasource)
```

Represents a binding between a predicate and a data source.

**Attributes:**

- **id**: The id of the Bind.
- **predicate_name**: The name of the predicate involved in the Bind.
- **bind_annotation**: The string with the binding annotation representing the Bind.
- **datasource**: The datasource involved in the Bind.

### Methods

    `get_database_alias(self)`
    : Returns the alias of the database whose datasource is associated with the Bind instance.

    `get_database_type(self)`
    : Returns the type of the database whose datasource is associated with the Bind instance.

    `get_datasource(self)`
    : Returns the datasource associated with the Bind instance.

    `from_dict(data)`
    : Creates a Bind instance from a dictionary.

    `to_dict(self)`
    : Converts the object to a dictionary suitable for JSON serialization.

# BindTable

---
**Module**: `prometheux_chain.logic.BindTable`

Classes
-------

```python
BindTable(bindings: List[prometheux_chain.logic.Bind.Bind])
```

Represents a collection of Bind instances

**Attributes:**

- **bindings**: the list of Bind instances in the BindTable.

    ### Methods

    `get(self, index)`
    : Retrieves a Bind instance at the specified index.

    `get_bindings(self)`
    : Returns the list of Bind instances.

    `show(self, max_rows=None, max_colwidth=None)`
    : Displays the bindings in a tabular format using a pandas DataFrame.

    `from_dict(data)`
    : Creates a BindTable instance from a dictionary.

    `to_dict(self)`
    : Converts the object to a dictionary suitable for JSON serialization.

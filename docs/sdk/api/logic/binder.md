# binder

---

**Module**: `prometheux_chain.logic.binder`

## Functions

```python
def bind_input(ontology: Ontology, databases: List[DatabaseInfo])
```

Generates a table of potential bindings for the input predicates of a given ontology based on a list of connected databases.

### Parameters

- **ontology**: An instance of the `Ontology` class representing the ontology.
- **databases**: A list of `DatabaseInfo` instances representing the databases.

### Returns

- **BindTable**: An instance of the `BindTable` class containing the potential bindings.

```python
def select_bindings(bind_table: BindTable, bind_indexes: List[int])
```

Selects specific bindings from a given `BindTable` based on a list of indexes.

### Parameters

- **bind_table**: An instance of the `BindTable` class containing the available bindings.
- **bind_indexes**: A list of indexes specifying which bindings to select.

### Returns

- **BindTable**: An instance of the `BindTable` class containing the selected bindings.

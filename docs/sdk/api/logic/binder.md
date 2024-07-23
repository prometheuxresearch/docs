# binder

---

**Module**: `prometheux_chain.logic.binder`

## Functions

```python
bind_input(ontology: prometheux_chain.logic.Ontology.Ontology, databases: List[prometheux_chain.model.DatabaseInfo.DatabaseInfo])
```

Generates a table of potential bindings for the input predicates of a given ontology based on a list of connected databases.

### Parameters
- **ontology**: An instance of the `Ontology` class representing the ontology.
- **databases**: A list of `DatabaseInfo` instances representing the databases.

### Returns
- **BindTable**: An instance of the `BindTable` class containing the potential bindings.


```python
bind_output(ontology: prometheux_chain.logic.Ontology.Ontology, databases=None)
```

Generates a table of potential output bindings for the intensional predicates of a given ontology.

### Parameters
- **ontology**: An instance of the `Ontology` class representing the ontology.
- **databases** (optional): A list of databases (not used in the current implementation).

### Returns
- **BindTable**: An instance of the `BindTable` class containing the bindings for the intensional predicates.


```python
select_bindings(bind_table: prometheux_chain.logic.BindTable.BindTable, bind_indexes)
```

Selects specific bindings from a given `BindTable` based on a list of indexes.

### Parameters
- **bind_table**: An instance of the `BindTable` class containing the available bindings.
- **bind_indexes**: A list of indexes specifying which bindings to select.

### Returns
- **BindTable**: An instance of the `BindTable` class containing the selected bindings.




# query

The `query` module allows you to execute queries on a virtual knowledge graph (KG). It can accept either a query string or the file path to a query file.

---

## Function

```python
def query(virtual_kg, file_path_or_query: str, params=None)
```

**Parameters**
- `virtual_kg`:
The virtual knowledge graph to query. This is the json result of reasoning.

- `file_path_or_query` _(str)_:
A query string or the file path to a .vadaquery file that contains the query to be executed. It accepts `Vadalog` or `sql` queries in a `.vada` or `.sql` files or in a string format.

- `params` _(dict, optional)_:
Optional parameters for the query, allowing customization of the execution.

**Returns**

- A list of results from the query execution.

**Raises**
- An error occurs during the query execution.

**Example**
```python
import prometheux_chain as px
import os

# Define the path to the .vada file to be used for reasoning
os.environ['PMTX_TOKEN'] = 'my_pmtx_token'

# Perform reasoning on the .vada file
virtual_kg = px.reason(
    vada_file_paths="min_distance_from_city.vada",
    params={"min_distance": 100.0},
    to_explain=True,
    to_persist=True
)

# Perform query in vadalog over the virtual kg file
results_vada_str = px.query(
    virtual_kg,
    "?- min_distance(X,Y), Y == \"Brooklin\""
)

# Perform query in sql over the virtual kg file
results_sql_str = px.query(
    virtual_kg,
    "SELECT X,Y FROM min_distance WHERE Y = \"Brooklin\";"
)
```
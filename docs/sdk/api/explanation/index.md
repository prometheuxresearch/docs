# explainer

The `explainer` module provides functions to compute the explanation for a given fact from virtual knowledge graph.

---

## Function

```python
def explain(virtual_kg, fact_to_explain)
```

**Parameters**
- `virtual_kg`:
The virtual knowledge graph to query. This is the json result of reasoning.

- `fact_to_explain` _(str)_:
The fact to be explained. This must be provided as a string and should correspond to a fact returned from a query.

**Returns**

- A dictionary containing the explanation for the provided fact.

**Raises**
Exception in the following cases:
1. the virtual_kg is None or null.
2. the fact_to_explain is None, null, or empty.
3. there are no relevant facts in the KG to explain the given fact.
4. an error occurs during the explanation process.

**Example**
```python
import prometheux_chain as pmtx
import os

# Define the path to the .vada file to be used for reasoning
os.environ['PMTX_TOKEN'] = 'my_pmtx_token'

# Perform reasoning on the .vada file
virtual_kg = pmtx.reason(
    vada_file_paths="min_distance_from_city.vada",
    params={"min_distance": 100.0},
    to_explain=True,
    to_persist=True
)

# Perform query in vadalog over the virtual kg file
query_results = pmtx.query(
    virtual_kg,
    "?- min_distance(X,Y), Y == \"Brooklin\""
)

first_result = query_results[0] # min_distance("New York"|"Brooklin")

# Explain the fact using the virtual knowledge graph
explanation = pmtx.explain(
    virtual_kg,
    first_result
)
```
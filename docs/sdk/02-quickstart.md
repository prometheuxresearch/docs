# Quickstart

This guide demonstrates how to get started with the Prometheux Chain SDK. The example below outlines a typical workflow, including reasoning with a `.vada` file, querying a virtual knowledge graph, and explaining the results.

---

## Workflow

### Import the `prometheux_chain`
```python
import prometheux_chain as pmtx
import os
```

### Define the PMTX_TOKEN environment variable for authentication
```python
os.environ['PMTX_TOKEN'] = 'my_pmtx_token'
```

### Perform reasoning with a .vada file to create a virtual knowledge graph
```python
virtual_kg = pmtx.reason(
    vada_file_paths="min_distance_from_city.vada",  # Path to the .vada file
    params={"min_distance": 100.0},                # Parameters for the reasoning process
    to_explain=True,                               # Include explanations in the results
    to_persist=True                                # Persist the virtual KG
)
```

### Query the virtual knowledge graph
```python
query_results = pmtx.query(
    virtual_kg,                                   # Virtual KG to query
    "?- min_distance(X,Y), Y == \"Brooklin\""     # Query in Vadalog syntax
)
```

### Retrieve the first result from the query
```python
first_result = query_results[0]  # Example: min_distance("New York"|"Brooklin")
```

### Explain a fact from virtual KG to explain the first query result
```python
explanation = pmtx.explain(
    virtual_kg,                                   # Virtual KG for explanation
    first_result                                  # Fact to explain
)
```

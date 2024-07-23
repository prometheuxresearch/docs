# KnowledgeGraph

---
**Module**: `prometheux_chain.logic.KnowledgeGraph`

Classes
-------

```python
KnowledgeGraph(id=None, name='', ontologies: List[prometheux_chain.logic.Ontology.Ontology] = None, databases=None, bindings=None, schema='', for_chase=False)
```

Represents a knowledge graph with its associated ontologies, databases, and bindings.

**Attributes:**

- **id**: The unique identifier for the knowledge graph.
- **name**: The name of the knowledge graph.
- **ontologies**: A list of `Ontology` instances involved in the Knowledge Graph. Default is an empty list.
- **databases**: A list of connected databases involved in the Knowledge Graph. Default is an empty list.
- **bindings**: A list of `Bind` instances involved in the Knowledge Graph. Default is an empty list.
- **schema**: The schema of the knowledge graph. Default is an empty string.
- **for_chase**: A boolean indicating if the reasoning over the knowledge graph is for explanation. Default is `False`.


  ### Methods

  `from_dict(data)`
  : Creates a KnowledgeGraph instance from a dictionary

  `to_dict(self)`
  :   Converts the object to a dictionary for JSON serialization.
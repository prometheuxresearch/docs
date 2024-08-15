# reasoner

---

**Module**: `prometheux_chain.reasoning.reasoner`

## Functions

```python
def reason(ontology: prometheux_chain.logic.Ontology.Ontology,
           bind_input_table: prometheux_chain.logic.BindTable.BindTable,
           bind_output_table: prometheux_chain.logic.BindTable.BindTable,
           for_explanation=False) ‑> ReasoningResult
```

Performs reasoning on a given ontology using input and output binding tables, and returning a `ReasoningResult` instance.

**Parameters:**

- **ontology**: An instance of the `Ontology` class representing the ontology.
- **bind_input_table**: An instance of the `BindTable` class containing the input bindings.
- **bind_output_table**: An instance of the `BindTable` class containing the output bindings.
- **for_explanation**: A boolean indicating if the reasoning is for explanation purposes (default is `False`).

**Returns:**

- **ReasoningResult**: An instance of the `ReasoningResult` class representing the result of the reasoning process.

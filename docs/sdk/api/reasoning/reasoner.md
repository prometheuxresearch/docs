# reasoner

---

**Module**: `prometheux_chain.reasoning.reasoner`

## Functions

```python
reason(ontologies : list[Ontology], bind_input_table: BindTable = None, bind_output_table: BindTable = None, for_explanation=False, params : dict = {}):
    if isinstance(ontologies, Ontology) ‑> list[prometheux_chain.reasoning.ReasoningResult.ReasoningResult]
```

Performs reasoning on a given ontology using input and output binding tables, and returning a list of `ReasoningResult`.

**Parameters:**

- **ontologies**: A list of `Ontology` class representing the ontology.
- **bind_input_table**: An instance of the `BindTable` class containing the input bindings.
- **bind_output_table**: An instance of the `BindTable` class containing the output bindings.
- **for_explanation**: A boolean indicating if the reasoning is for explanation purposes (default is `False`).
- **params**: A dict of params to be passed to the Ontologies programs.

**Returns:**

- **List[ReasoningResult]**: A list of `ReasoningResult` representing the results of the reasoning process.


### Reasoning with params syntax

```python
reasoning_tasks = prometheux_chain.reason(ontologies, for_explanation = True, params={"my_param":value})
```
# Fact

---
**Module**: `prometheux_chain.logic.Fact`

Classes
-------

```python
Fact(fact, textual_explanation, visual_explanation, chase_explanation, is_for_chase, reasoning_task_id, knowledge_graph_id)
```

Represents a Vadalog fact along with its textual and visual explanations and related metadata. 

**Attributes:**

- **fact**: The fact itself.
- **textual_explanation**: A textual explanation of the fact.
- **visual_explanation**: A visual explanation of the fact.
- **chase_explanation**: An explanation of the step-by-step reasoning for the fact.
- **is_for_chase**: A boolean indicating if the fact has been generated with the explanation or not.
- **reasoning_task_id**: The identifier for the reasoning task associated with the fact.
- **knowledge_graph_id**: The identifier for the knowledge graph associated with the fact.


### Methods

    `from_dict(data)`
    : Creates a Fact instance from a dictionary.

    `to_dict(self)`
    : Converts the object to a dictionary suitable for JSON serialization.
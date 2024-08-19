# Rule

---

**Module**: `prometheux_chain.logic.Rule`

## Classes

```python
class Rule(id=None, logic='', nl_description='', position_in_ontology=0)
```

Represents a rule within an ontology, including its logic, natural language description, and position in the ontology

**Attributes:**

- **id**: The unique identifier for the rule.
- **logic**: The logical representation of the rule.
- **nlDescription**: The natural language description of the rule.
- **positionInOntology**: The position of the rule within the ontology.

### Methods

    `to_dict(self)`
    : Converts the object to a dictionary suitable for JSON serialization.

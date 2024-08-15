# Ontology

---

**Module**: `prometheux_chain.logic.Ontology`

## Classes

```python
class Ontology(id, name, short_description, long_description, domain_knowledge)
```

Represents an ontology with its associated predicates and rules.

**Attributes:**

- **id**: The unique identifier for the ontology.
- **name**: The name of the ontology.
- **shortDescription**: A short description of the ontology.
- **longDescription**: A long description of the ontology.
- **domainKnowledge**: The domain knowledge representing the ontology.

### Methods

    `add_input_predicate(self, predicate)`
    : Adds an input predicate to the ontology

    `add_intensional_predicate(self, predicate)`
    : Adds an intensional predicate to the ontology

    `add_output_predicate(self, predicate)`
    : Adds an output predicate to the ontology

    `add_rule(self, rule)`
    : Adds a rule to the ontology

    `show_rules(self, max_rows=None, max_colwidth=None)`
    : Displays the rules in a tabular format

    `from_dict(data)`
    : Creates an Ontology instance from a dictionary.

    `to_dict(self)`
    : Converts the object to a dictionary suitable for JSON serialization.

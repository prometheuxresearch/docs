# explainer

---

**Module**: `prometheux_chain.explanation.explainer`

## Functions

```python
def explain(structured_fact: logic.Fact = None,
            fact = None,
            csv_path = None,
            json_glossary = None) -> String
```

Generates a textual and a visual explanation for a given fact after the reasoning process.

**Parameters:**

- `structured_fact` (prometheux_chain.logic.Fact.Fact, optional): A structured fact object.
- `fact` (any, optional): A raw fact that needs explanation.
- `csv_path` (str, optional): Path to a CSV file containing the step-by-step reasoning to get the explanation from.
- `json_glossary` (str, optional): Path to a JSON file containing natural language descriptions of predicates.

**Returns:**

- `String`: A textual explanation of the fact of interest.

# ReasoningResult

---
**Module**: `prometheux_chain.reasoning.ReasoningResult`

Classes
-------

```python
ReasoningResult(output_predicate, knowledge_graph_id, page=-1, size=50, sort_property='fact', asc=True)
```

Represents the result of a reasoning query, including pagination and sorting options.

### Attributes

- **output_predicate**: The output predicate for the reasoning result.
- **knowledge_graph_id**: The identifier for the corresponding knowledge graph.
- **page**: The current page number (default is -1).
- **size**: The number of elements per page (default is 50).
- **sort_property**: The property to sort by (default is "fact").
- **asc**: A boolean indicating if sorting is in ascending order (default is `True`).
 

### Methods

    `get(self, new_page=None, new_page_size=None)`
    : Fetches the reasoning results for the specified page and page size.

    `next(self)`
    : Advances to the next page.

    `prev(self)`
    : Moves to the previous page.

    `set_page(self, new_page)`
    : Sets the page number to the specified value.

    `set_page_size(self, new_page_size)`
    : Sets the page size to the specified value.

    `to_dict(self)`
    : Converts the object to a dictionary for JSON serialization.
# ReasoningResult

---

**Module**: `prometheux_chain.reasoning.ReasoningResult`

## Classes

```python
class ReasoningResult(knowledge_graph_id: String,
                      reasoning_status_code: Integer,
                      reasoning_message: String
                      page=-1,
                      size=50,
                      sort_property='fact',
                      asc=True)`
```

Represents the result of a reasoning query, including pagination and sorting options.

### Attributes

- **knowledge_graph_id**: The identifier for the corresponding knowledge graph.
- **reasoning_status_code**: The status code for the corresponding reasoning task.
- **reasoning_message**: The success or failure message for the corresponding reasoning task.
- **page**: The current page number (default is -1).
- **size**: The number of elements per page (default is 50).
- **sort_property**: The property to sort by (default is "fact").
- **asc**: A boolean indicating if sorting is in ascending order (default is `True`).

### Methods

    `get(self, output_predicate = "", new_page=None, new_page_size=None)`
    : Fetches the reasoning results for the provided output predicate at the specified page and page size.

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

```

```

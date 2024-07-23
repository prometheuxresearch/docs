# Pagination

---
**Module**: `prometheux_chain.model.Pagination`

Classes
-------

```python
Pagination(sort, page_number, page_size, offset, paged, unpaged)
```

Represents pagination information, including sorting details, page number, page size, offset, and whether the pagination is active.

### Attributes
- **sort**: The sorting information.
- **page_number**: The current page number.
- **page_size**: The number of elements per page.
- **offset**: The offset of the elements in the current page.
- **paged**: A boolean indicating if pagination is active.
- **unpaged**: A boolean indicating if pagination is not active.


### Methods

    `from_dict(data)`
    : Creates a Pagination object from a dictionary
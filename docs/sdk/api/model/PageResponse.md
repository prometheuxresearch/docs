# PageResponse

---
**Module**: `prometheux_chain.model.PageResponse`

Classes
-------

```python
PageResponse(content, pagination, total_pages, total_elements, last, size, number, sort, number_of_elements, first, empty)
```

Represents a paginated response containing a list of `Fact` instances and pagination information.

### Attributes
- **content**: A list of `Fact` instances.
- **pagination**: An instance of the `Pagination` class representing pagination information.
- **total_pages**: The total number of pages in the response.
- **total_elements**: The total number of elements in the response.
- **last**: A boolean indicating if this is the last page.
- **size**: The number of elements per page.
- **number**: The current page number.
- **sort**: The sorting information.
- **number_of_elements**: The number of elements in the current page.
- **first**: A boolean indicating if this is the first page.
- **empty**: A boolean indicating if the content is empty. 


### Methods

    `get(self, index)`
    : Returns the `Fact` instance at the specified index.

    `show(self, max_rows=None, max_colwidth=None)`
    : Displays the content in a tabular format using a pandas DataFrame.

    `from_dict(data)`
    : Creates a PageResponse object from a dictionary.
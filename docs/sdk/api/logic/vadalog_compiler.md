# vadalog_compiler

---

**Module**: `prometheux_chain.logic.vadalog_compiler`

## Functions

---

```python
def compile_vadalog(file_paths: Union[str, List[Union[str, List[str]]]], attempts: int = 0) -> List[Ontology]
```

Reads and compiles a single `.vada` file, or a list of `.vada` files organized into multiple ontologies.
The function returns a list of compiled `Ontology` objects, or raises an error if compilation fails.

### Parameters:

- **file_paths** (`str` or `List[Union[str, List[str]]]`):
    - A string representing the path to a single `.vada` file.
    - A list of lists, where each internal list contains `.vada` file paths to be compiled together as a single ontology.
    - The outer list contains multiple ontologies to be compiled and reasoned over sequentially.

- **attempts** (`int`, optional): The number of retry attempts for compilation in case of a rate-limiting error (`HTTP 429`). The default value is `0`.

### Returns:

- **List[Ontology]**: A list of instances of the `Ontology` class, representing the compiled ontologies.

## Examples:

### Compiling a single `.vada` file:
```python
compiled_ontology = compile_vadalog("path_to_file.vada")
```
This compiles a single Vadalog file located at `"path_to_file.vada"`.

### Compiling multiple `.vada` files into one ontology:
```python
compiled_ontologies = compile_vadalog([["file_1.vada", "file_2.vada"]])
```
This example compiles two `.vada` files (`file_1.vada` and `file_2.vada`) together into a single ontology.

### Compiling multiple ontologies:
```python
compiled_ontologies = compile_vadalog([
["ontology_1_file_1.vada", "ontology_1_file_2.vada"],
["ontology_2_file_1.vada"]
])
```
In this case, the first list `["ontology_1_file_1.vada", "ontology_1_file_2.vada"]` compiles together into the first ontology. The second list `["ontology_2_file_1.vada"]` compiles into a separate ontology. Both ontologies are compiled and reasoned over sequentially.

### Compiling with automatic retry:
```python
compiled_ontologies = compile_vadalog([
["ontology_1_file.vada"],
["ontology_2_file.vada"]
], attempts=3)
```
This example attempts to compile two ontologies with up to 3 retry attempts if rate-limited by the server.
```

# vadalog_compiler

---

**Module**: `prometheux_chain.logic.vadalog_compiler`

## Functions

---

```python
def compile_vadalog(file_paths: Union[str, List[Union[str, List[str]]]],
                    user_prompt: Optional[str] = None,
                    attempts: int = 0) -> List[Ontology]
```

Reads and compiles a single `.vada` file, or a list of `.vada` files organized into multiple ontologies.
The function returns a list of compiled `Ontology` objects, or raises an error if compilation fails.

### Parameters:

- **file_paths** (`str` or `List[Union[str, List[str]]]`):
    - A string representing the path to a single `.vada` file.
    - A list of lists, where each internal list contains `.vada` file paths to be compiled together as a single ontology.
    - The outer list contains multiple ontologies to be compiled and reasoned over sequentially.

- **user_prompt** (`str`, optional):
    - A user-provided prompt to inject into LLMs interactions during the compilation process.
    - This allows the user to specify how the system should explain or process the ontologies.

- **attempts** (`int`, optional): The number of retry attempts for compilation in case of a rate-limiting error (`HTTP 429`). The default value is `0`.

### Returns:

- **List[Ontology]**: A list of instances of the `Ontology` class, representing the compiled ontologies.
- The function also automatically generates natural language (NL) descriptions in model annotations if the description field is left empty. It updates the `.vada` file with these generated descriptions. 
The descriptions are created based on the context of the model, potentially influenced by the optional user_prompt. 
For more details on how to format model annotations and avoid syntax issues, please refer to [Model Annotation Documentation](https://www.prometheux.co.uk/docs/learn/vadalog/annotations#model)

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

### Compiling with custom prompt:
```python
compiled_ontologies = compile_vadalog(
  ["aggregated_simplified.vada"],
  user_prompt="Use technical language appropriate for a data scientist audience"
)
```
This example compiles a `.vada` file with a custom prompt that will influence how the system explains the models.

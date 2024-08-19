# vadalog_compiler

---
**Module**: `prometheux_chain.logic.vadalog_compiler`

## Functions
---------

```python
compile_vadalog(file_path)
```
```python
compile_vadalog([file_path_1, file_path_2,...])
```

Reads a Vadalog file or a list of Vadalog files and returns the compiled ontologies or an error if the compilation is failed.

**Parameters:**

- **file_path**: A string representing the path to the file containing the Vadalog file.

**Returns:**

- **Ontology**: An instance of the `Ontology` class representing the compiled ontology.

### Compiling multiple .vada files syntax

```python
ontologies = prometheux_chain.compile(["file_1.vada","file_2.vada",...])
```


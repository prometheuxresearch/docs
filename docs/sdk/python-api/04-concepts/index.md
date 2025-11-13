---
slug: /sdk/python-api/concepts
---

# Concepts

The `concepts` module provides functions for managing concepts in the Prometheux platform. It allows you to create, run, list, and clean up concepts, as well as perform GraphRAG operations.

---

## Functions

### save_concept

Saves concept logic for a specific project.

```python
def save_concept(workspace_id="workspace_id", project_id=None, concept_logic=None, scope="user", python_scripts=None)
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `project_id` _(str, optional)_:
  The project identifier. Required for saving concepts.

- `concept_logic` _(str, optional)_:
  The Vadalog logic defining the concept. Required for saving concepts.

- `scope` _(str, optional)_:
  The scope of the concept. Defaults to "user".

- `python_scripts` _(dict, optional)_:
  Dictionary of Python scripts to inject into the concept. Keys are script names and values are the script content as strings. Defaults to None.

**Returns**
- The response data from saving the concept.

**Raises**
- Exception: If an error occurs during concept saving.

**Example**
```python
import prometheux_chain as px

# Define concept logic in Vadalog
concept_logic = """
company("Apple", "Redwood City, CA").
company("Google", "Mountain View, CA").
company("Microsoft", "Redmond, WA").

location(Location) :- company(_,Location).

@output("location").
"""

# Save the concept
result = px.save_concept(
    project_id="my_project_id",
    concept_logic=concept_logic
)
```

**Example with Python Script Ingestion**
```python
import prometheux_chain as px

# Define a Python script with proper structure
python_script = """
import json

def main():
    # Simple calculations
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    
    # Calculate basic statistics
    total = sum(numbers)
    average = total / len(numbers)
    maximum = max(numbers)
    minimum = min(numbers)
    
    # Create results as a list of dictionaries (tabular format)
    results = [
        {
            "Numbers": numbers,
            "Total": total,
            "Average": round(average, 2),
            "Maximum": maximum,
            "Minimum": minimum,
            "Count": len(numbers)
        }
    ]
    
    return results
"""

# Define concept logic that uses Python script execution
concept_logic = """
@output("test_python").
test_python(Numbers,Total,Average,Maximum,Minimum,Count) :- python:run("python_script").
"""

# Save the concept with Python script injection
result = px.save_concept(
    project_id="my_project_id",
    concept_logic=concept_logic,
    python_scripts={
        "python_script": python_script
    }
)
```

---

## Python Script Injection Requirements

When using Python script injection with `save_concept`, there are specific requirements that must be followed:

### 1. Main Function Requirement
Every Python script **must** contain a `main()` function that serves as the entry point:

```python
def main():
    # Your script logic here
    return results
```

### 2. Tabular Output Format
The `main()` function must return results in a tabular format, for example as a list of dictionaries. Each dictionary represents a row, and the keys represent column names:

```python
def main():
    # Calculate results
    results = [
        {
            "Column1": value1,
            "Column2": value2,
            "Column3": value3
        }
    ]
    return results
```

### 3. Concept Head Alignment
The output column names in your Python script must match the parameters in the concept head of your Vadalog rule:

```python
# Python script returns:
results = [
    {
        "Numbers": [1, 2, 3],
        "Total": 6,
        "Average": 2.0
    }
]

# Vadalog concept head must match:
test_python(Numbers, Total, Average) :- python:run("python_script").
```

### 4. Standalone Concept Rule
Python script concepts must be **standalone** - you cannot combine Python script execution with other logic in the same rule. The rule should only contain the `python:run()` call:

```python
# ✅ Correct - standalone Python script concept
@output("my_python_concept").
my_python_concept(Col1, Col2) :- python:run("my_script").

# ❌ Incorrect - cannot combine with other logic
@output("mixed_concept").
mixed_concept(Col1, Col2) :- python:run("my_script"), other_predicate(Col1).
```

### 5. Using Python Concepts as Input
Once created, Python script concepts can be used as input to other concepts just like any regular concept:

```python
# Create a Python script concept
px.save_concept(
    project_id=project_id,
    concept_logic="@output(\"python_data\").\npython_data(Value) :- python:run(\"data_script\").",
    python_scripts={"data_script": python_script}
)

# Use it in another concept
px.save_concept(
    project_id=project_id,
    concept_logic="""
    @output("processed_data").
    processed_data(ProcessedValue) :- python_data(Value), ProcessedValue = Value * 2.
    """
)
```

### run_concept

Runs a concept for a specific project.

```python
def run_concept(workspace_id="workspace_id", project_id=None, concept_name=None, params=None, project_scope="user", step_by_step=False, materialize_intermediate_concepts=False, force_rerun=True, persist_outputs=False)
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `project_id` _(str, optional)_:
  The project identifier. Required for running concepts.

- `concept_name` _(str, optional)_:
  The name of the concept to run. Required for running concepts.

- `params` _(dict, optional)_:
  Parameters to pass to the concept execution. Defaults to empty dict.

- `project_scope` _(str, optional)_:
  The scope of the project. Defaults to "user".

- `step_by_step` _(bool, optional)_:
  Whether to execute the concept step by step. Defaults to False.

- `materialize_intermediate_concepts` _(bool, optional)_:
  Whether to materialize intermediate concepts. Defaults to False.

- `force_rerun` _(bool, optional)_:
  Whether to force rerun even if results exist. Defaults to True.

- `persist_outputs` _(bool, optional)_:
  Whether to persist the outputs. Defaults to False.

**Returns**
- The execution results data.

**Raises**
- Exception: If an error occurs during concept execution.

**Example**
```python
import prometheux_chain as px

# Run a concept with parameters
results = px.run_concept(
    project_id="my_project_id",
    concept_name="location",
    params={"filter_city": "CA"},
    step_by_step=True,
    persist_outputs=True
)
```

### list_concepts

Lists all concepts for a specific project.

```python
def list_concepts(workspace_id="workspace_id", project_id=None, project_scope="user")
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `project_id` _(str, optional)_:
  The project identifier. Required for listing concepts.

- `project_scope` _(str, optional)_:
  The scope of the project. Defaults to "user".

**Returns**
- List of concept information dictionaries.

**Raises**
- Exception: If an error occurs while listing concepts.

**Example**
```python
import prometheux_chain as px

# List all concepts in a project
concepts = px.list_concepts(project_id="my_project_id")
print(f"Available concepts: {concepts}")
```

### cleanup_concepts

Cleans up concepts for a specific project.

```python
def cleanup_concepts(workspace_id="workspace_id", project_id=None, project_scope="user")
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `project_id` _(str, optional)_:
  The project identifier. If None, cleans up all concepts for the user.

- `project_scope` _(str, optional)_:
  The scope of the project. Defaults to "user".

**Returns**
- The cleanup response data.

**Raises**
- Exception: If an error occurs during concept cleanup.

**Example**
```python
import prometheux_chain as px

# Clean up all concepts in a project
result = px.cleanup_concepts(project_id="my_project_id")

# Clean up all user concepts
result = px.cleanup_concepts()
```



---

## Complete Workflow Example

```python
import prometheux_chain as px
import os

# Set up authentication and configuration
os.environ['PMTX_TOKEN'] = 'my_pmtx_token'
px.config.set('JARVISPY_URL', "https://api.prometheux.ai/jarvispy/[my_organization]/[my_username]")

# Create a project
project_id = px.save_project(project_name="concept_demo")

# Define and save a traditional concept
concept_logic = """
company("Apple", "Redwood City, CA").
company("Google", "Mountain View, CA").
company("Microsoft", "Redmond, WA").

location(Location) :- company(_,Location).

@output("location").
"""

px.save_concept(project_id=project_id, concept_logic=concept_logic)

# Define and save a Python script concept
python_script = """
import json

def main():
    # Simple calculations
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    
    # Calculate basic statistics
    total = sum(numbers)
    average = total / len(numbers)
    maximum = max(numbers)
    minimum = min(numbers)
    
    # Create results as a list of dictionaries (tabular format)
    results = [
        {
            "Numbers": numbers,
            "Total": total,
            "Average": round(average, 2),
            "Maximum": maximum,
            "Minimum": minimum,
            "Count": len(numbers)
        }
    ]
    
    return results
"""

px.save_concept(
    project_id=project_id, 
    concept_logic="@output(\"test_python\").\ntest_python(Numbers,Total,Average,Maximum,Minimum,Count) :- python:run(\"python_script\").",
    python_scripts={
        "python_script": python_script
    }
)

# List all concepts
concepts = px.list_concepts(project_id=project_id)
print(f"Available concepts: {concepts}")

# Run the traditional concept
results = px.run_concept(project_id=project_id, concept_name="location")

# Run the Python script concept
python_results = px.run_concept(project_id=project_id, concept_name="test_python")

# Clean up when done
px.cleanup_concepts(project_id=project_id)
```

# Knowledge Graphs

The `knowledge_graphs` module provides functions for managing virtual knowledge graphs in the Prometheux platform. It allows you to create and load knowledge graphs that combine multiple concepts into a unified graph structure.

---

## Functions

### save_kg

Saves a virtual knowledge graph for a project by combining multiple concepts.

```python
def save_kg(workspace_id="workspace_id", project_id=None, concepts=None, scope="user")
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `project_id` _(str, optional)_:
  The project identifier. Required for saving knowledge graphs.

- `concepts` _(list, optional)_:
  List of concept names to include in the knowledge graph. Required and must be a non-empty list.

- `scope` _(str, optional)_:
  The scope of the project. Defaults to "user".

**Returns**
- Response from the API containing the saved knowledge graph information.

**Raises**
- ValueError: If `project_id` is not provided or `concepts` is not a valid non-empty list.

**Example**
```python
import prometheux_chain as px

# Save a knowledge graph combining multiple concepts
kg_response = px.save_kg(
    project_id="my_project_id",
    concepts=["company", "location", "ownership", "financial_data"]
)
```

### load_kg

Loads a virtual knowledge graph for a project.

```python
def load_kg(workspace_id="workspace_id", project_id=None, scope="user")
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `project_id` _(str, optional)_:
  The project identifier. Required for loading knowledge graphs.

- `scope` _(str, optional)_:
  The scope of the project. Defaults to "user".

**Returns**
- Response from the API containing the loaded knowledge graph data including:
  - `project_id`: The project ID
  - `name`: The knowledge graph name
  - `concepts`: List of concepts in the knowledge graph
  - `rules`: List of rules in the knowledge graph
  - `timestamp`: When the knowledge graph was created/modified
  - `author`: Who created the knowledge graph

**Raises**
- ValueError: If `project_id` is not provided.

**Example**
```python
import prometheux_chain as px

# Load a knowledge graph
kg_data = px.load_kg(project_id="my_project_id")

# Access knowledge graph information
print(f"KG Name: {kg_data['name']}")
print(f"Concepts: {kg_data['concepts']}")
print(f"Rules: {kg_data['rules']}")
print(f"Created: {kg_data['timestamp']}")
print(f"Author: {kg_data['author']}")
```

---

## Complete Workflow Example

```python
import prometheux_chain as px
import os

# Set up authentication and configuration
os.environ['PMTX_TOKEN'] = 'my_pmtx_token'
px.config.set('JARVISPY_URL', "https://platform.prometheux.ai/jarvispy/'my_organization'/'my_username'")

# Create a project
project_id = px.save_project(project_name="kg_demo")

# Define and save multiple concepts
company_logic = """
company("Apple", "Technology").
company("Google", "Technology").
company("Microsoft", "Technology").

@output("company").
"""

location_logic = """
location("Apple", "Redwood City, CA").
location("Google", "Mountain View, CA").
location("Microsoft", "Redmond, WA").

@output("location").
"""

ownership_logic = """
ownership("Apple", "Tim Cook", "CEO").
ownership("Google", "Sundar Pichai", "CEO").
ownership("Microsoft", "Satya Nadella", "CEO").

@output("ownership").
"""

# Save all concepts
px.save_concept(project_id=project_id, concept_logic=company_logic)
px.save_concept(project_id=project_id, concept_logic=location_logic)
px.save_concept(project_id=project_id, concept_logic=ownership_logic)

# Run all concepts
px.run_concept(project_id=project_id, concept_name="company")
px.run_concept(project_id=project_id, concept_name="location")
px.run_concept(project_id=project_id, concept_name="ownership")

# Create a knowledge graph combining all concepts
kg_response = px.save_kg(
    project_id=project_id,
    concepts=["company", "location", "ownership"]
)

# Load the knowledge graph
kg_data = px.load_kg(project_id=project_id)
print(f"Knowledge Graph loaded: {kg_data['name']}")
```

---

## Use Cases

### Financial Analysis Knowledge Graph

```python
# Create a comprehensive financial analysis KG
financial_concepts = [
    "company_financials",
    "market_data", 
    "risk_assessment",
    "regulatory_compliance",
    "ownership_structure"
]

kg_response = px.save_kg(
    project_id=project_id,
    concepts=financial_concepts
)
```

### Supply Chain Knowledge Graph

```python
# Create a supply chain analysis KG
supply_chain_concepts = [
    "suppliers",
    "manufacturers",
    "distributors",
    "customers",
    "logistics",
    "inventory"
]

kg_response = px.save_kg(
    project_id=project_id,
    concepts=supply_chain_concepts
)
```

### Healthcare Knowledge Graph

```python
# Create a healthcare analytics KG
healthcare_concepts = [
    "patients",
    "diagnoses",
    "treatments",
    "medications",
    "providers",
    "outcomes"
]

kg_response = px.save_kg(
    project_id=project_id,
    concepts=healthcare_concepts
)
```

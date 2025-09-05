# Graph RAG

The `graph_rag` function performs GraphRAG (Graph Retrieval-Augmented Generation) operations, combining graph reasoning with retrieval-augmented generation to answer questions using both structured data and language models.

---

## Function

```python
def graph_rag(workspace_id="workspace_id", project_id, question, graph_selected_concepts=None, graph_available_concepts=None, rag_concepts=None, rag_records=None, project_scope="user", llm=None, top_k=5)
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `project_id` _(str)_:
  The project identifier. Required for GraphRAG operations.

- `question` _(str)_:
  The question to answer. Required for GraphRAG operations.

- `graph_selected_concepts` _(list, optional)_:
  List of concept names to directly execute for graph operations. If provided, this takes priority over `graph_available_concepts`.

- `graph_available_concepts` _(list, optional)_:
  List of concept names available to the LLM orchestrator for automatic concept selection. If neither this nor `graph_selected_concepts` is provided, the orchestrator will choose among all concepts in the project.

- `rag_concepts` _(list, optional)_:
  List of dictionaries with concept and field information for RAG operations.
  Format: `[{"concept": "concept_name", "field_to_embed": "field_name"}]`

- `rag_records` _(list, optional)_:
  List of retrieved records for RAG operations.

- `project_scope` _(str, optional)_:
  The scope of the project. Defaults to "user".

- `llm` _(dict, optional)_:
  LLM configuration dictionary.

- `top_k` _(int, optional)_:
  Number of top results to retrieve. Defaults to 5.

**Returns**
- The GraphRAG response data.

**Raises**
- Exception: If an error occurs during GraphRAG operations or if question is not provided.

---

## GraphRAG Modes

GraphRAG supports different modes for both embeddings and graph concepts:

### Embedding Modes

1. **Internal Embeddings**: The system performs embedding-based retrieval internally by specifying which concept and field to embed using `rag_concepts`.

2. **External Embeddings**: You provide the results of embedding-based retrieval directly using `rag_records`.

### Graph Concept Modes

1. **Explicit Graph Concepts**: You explicitly specify which graph concepts to run using `graph_selected_concepts`.

2. **Implicit Graph Concepts**: The LLM-based orchestrator automatically decides which concepts to run based on the question and available concepts specified in `graph_available_concepts`. If neither parameter is provided, the orchestrator will choose from all concepts in the project.

---

## Examples

### Internal Embeddings + Explicit Graph Concepts

```python
import prometheux_chain as px

# Full control over both embedding and graph operations
result = px.graph_rag(
    project_id="my_project_id",
    question="What companies are located in California?",
    rag_concepts=[
        {"concept": "company", "field_to_embed": "name"},
        {"concept": "location", "field_to_embed": "city"}
    ],
    graph_selected_concepts=["company", "location"]
)
```

### External Embeddings + Implicit Graph Concepts

```python
import prometheux_chain as px

# Provide your own embeddings, let orchestrator choose graph concepts
rag_records = {
    "company": [["Apple", "Google", "Microsoft"]],
    "location": [["Redwood City, CA", "Mountain View, CA", "Redmond, WA"]]
}

result = px.graph_rag(
    project_id="my_project_id",
    question="Which companies are in California?",
    rag_records=rag_records
    # No graph parameters specified - orchestrator will choose from all project concepts
)
```

### Internal Embeddings + Implicit Graph Concepts

```python
import prometheux_chain as px

# Control embeddings, let orchestrator choose graph concepts
result = px.graph_rag(
    project_id="my_project_id",
    question="Find companies in California",
    rag_concepts=[
        {"concept": "location", "field_to_embed": "city"}
    ]
    # No graph parameters specified - orchestrator will choose from all project concepts
)
```

### External Embeddings + Explicit Graph Concepts

```python
import prometheux_chain as px

# Provide your own embeddings, specify graph concepts
rag_records = {
    "company": [["Apple", "Google", "Microsoft"]]
}

result = px.graph_rag(
    project_id="my_project_id",
    question="Which companies are in California?",
    rag_records=rag_records,
    graph_selected_concepts=["location"]
)
```



---

## Complete Workflow Example

```python
import prometheux_chain as px
import os

# Set up authentication and configuration
os.environ['PMTX_TOKEN'] = 'my_pmtx_token'
px.config.set('JARVISPY_URL', "https://platform.prometheux.ai/jarvispy/[my_organization]/[my_username]")

# Create a project
project_id = px.save_project(project_name="graphrag_demo")

# Define and save concepts
concept_logic = """
company("Apple", "Redwood City, CA").
company("Google", "Mountain View, CA").
company("Microsoft", "Redmond, WA").

location(Location) :- company(_,Location).

@output("location").
"""

px.save_concept(project_id=project_id, concept_logic=concept_logic)

# Run the concept
px.run_concept(project_id=project_id, concept_name="location")

# Perform GraphRAG query
rag_result = px.graph_rag(
    project_id=project_id,
    question="Which companies are in California?",
    graph_selected_concepts=["location"]
)
```


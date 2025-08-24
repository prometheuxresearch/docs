# Graph RAG

The `graph_rag` function performs GraphRAG (Graph Retrieval-Augmented Generation) operations, combining graph reasoning with retrieval-augmented generation to answer questions using both structured data and language models.

---

## Function

```python
def graph_rag(workspace_id="workspace_id", project_id=None, question=None, graph_concepts=None, rag_concepts=None, rag_records=None, project_scope="user", llm=None, top_k=5)
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `project_id` _(str, optional)_:
  The project identifier. Required for GraphRAG operations.

- `question` _(str, optional)_:
  The question to answer. Required for GraphRAG operations.

- `graph_concepts` _(list, optional)_:
  List of concept names to use for graph operations.

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

## Examples

### Basic GraphRAG with Graph Concepts

```python
import prometheux_chain as px

# Perform GraphRAG with graph concepts
result = px.graph_rag(
    project_id="my_project_id",
    question="What companies are located in California?",
    graph_concepts=["company", "location"],
    top_k=10
)
```

### GraphRAG with RAG Concepts

```python
import prometheux_chain as px

# Perform GraphRAG with RAG concepts
result = px.graph_rag(
    project_id="my_project_id",
    question="What are the latest product reviews?",
    rag_concepts=[
        {"concept": "reviews", "field_to_embed": "content"},
        {"concept": "products", "field_to_embed": "description"}
    ],
    llm={"model": "gpt-4", "temperature": 0.7}
)
```

### Complete GraphRAG Workflow

```python
import prometheux_chain as px
import os

# Set up authentication and configuration
os.environ['PMTX_TOKEN'] = 'my_pmtx_token'
px.config.set('JARVISPY_URL', "https://platform.prometheux.ai/jarvispy/'my_organization'/'my_username'")

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
    graph_concepts=["location"],
    top_k=5
)
```

---

## Use Cases

### Company Control Analysis

```python
# Define company ownership concepts
ownership_logic = """
@input("ownership").
@bind("ownership","postgresql","ownership_db","ownership_table").

own(From,To) :- ownership(From,To,Weight).
@output("own").
"""

# Perform GraphRAG for control analysis
result = px.graph_rag(
    project_id=project_id,
    question="Can you explain why the company C-Corp owns Q-Tech?",
    graph_concepts=["own"],
    llm={"model": "gpt-4", "temperature": 0.3}
)
```

### Financial Data Analysis

```python
# Perform GraphRAG on financial data
result = px.graph_rag(
    project_id=project_id,
    question="What are the risk factors for non-performing loans?",
    rag_concepts=[
        {"concept": "loans", "field_to_embed": "risk_assessment"},
        {"concept": "financial_reports", "field_to_embed": "content"}
    ],
    top_k=10,
    llm={"model": "gpt-4", "temperature": 0.5}
)
```
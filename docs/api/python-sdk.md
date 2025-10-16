# Python SDK

For easier integration with the Prometheux platform, we provide a Python SDK that wraps all the REST API endpoints with a convenient, Pythonic interface.

## Installation

```bash
pip install prometheux-sdk
```

## Quick Start

```python
from prometheux_sdk import PrometheuxClient

# Initialize the client
client = PrometheuxClient(
    base_url="https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1",
    token="YOUR_JWT_TOKEN"
)

# Create a workspace
workspace = client.workspaces.create(
    name="My Analysis Workspace",
    description="Workspace for data analysis projects"
)

# Create a project
project = client.projects.create(
    workspace_id=workspace.id,
    name="Financial Analysis",
    description="Analyzing financial data patterns"
)

# Run a concept
result = client.concepts.run(
    workspace_id=workspace.id,
    project_id=project.id,
    concept_name="revenue_analysis",
    params={"year": 2024}
)

print(f"Analysis complete: {result.message}")
```

## SDK Classes

### PrometheuxClient

The main client class that provides access to all API endpoints.

```python
from prometheux_sdk import PrometheuxClient

client = PrometheuxClient(
    base_url="https://platform.prometheux.ai/jarvispy/org/user/api/v1",
    token="YOUR_JWT_TOKEN",
    timeout=30  # Optional: request timeout in seconds
)
```

### Workspaces

```python
# Create workspace
workspace = client.workspaces.create(
    name="Data Science Workspace",
    description="Main workspace for data science projects",
    metadata={"department": "analytics"}
)

# List workspaces
workspaces = client.workspaces.list(scope="user")

# Load specific workspace
workspace = client.workspaces.get(workspace_id="ws_123", scope="user")

# Export workspace data
export_data = client.workspaces.export(workspace_id="ws_123")

# Import workspace data
client.workspaces.import_data(
    export_data=export_data,
    workspace_id="ws_456"
)
```

### Projects

```python
# Create project
project = client.projects.create(
    workspace_id="ws_123",
    name="Customer Segmentation",
    description="Analyze customer behavior patterns",
    metadata={"priority": "high"}
)

# List projects
projects = client.projects.list(workspace_id="ws_123", scopes=["user", "organization"])

# Load project
project = client.projects.get(
    workspace_id="ws_123",
    project_id="proj_456"
)

# Create project from context and files
project = client.projects.create_from_context(
    workspace_id="ws_123",
    context="Analyze customer purchase patterns for marketing optimization",
    files=["customer_data.csv", "sales_report.pdf"]
)

# Export project
export_data = client.projects.export(
    workspace_id="ws_123",
    project_id="proj_456"
)

# Import project
imported_project = client.projects.import_data(
    workspace_id="ws_789",
    export_data=export_data
)

# Copy project
copied_project = client.projects.copy(
    source_workspace_id="ws_123",
    source_project_id="proj_456",
    target_workspace_id="ws_789",
    new_name="Copy of Customer Segmentation"
)
```

### Concepts

```python
# Save concept
client.concepts.save(
    workspace_id="ws_123",
    project_id="proj_456",
    concept_logic="""
    @input("customers").
    @output("high_value_customers").
    high_value_customers(Customer, Value) :- 
        customers(Customer, _, Value), 
        Value > 1000.
    """,
    python_scripts={
        "data_processor": "def process_customers(df): return df[df.value > 1000]"
    }
)

# Run concept
result = client.concepts.run(
    workspace_id="ws_123",
    project_id="proj_456",
    concept_name="high_value_customers",
    params={"threshold": 1000},
    force_rerun=True
)

# List concepts
concepts = client.concepts.list(
    workspace_id="ws_123",
    project_id="proj_456"
)

# Rename concept
client.concepts.rename(
    workspace_id="ws_123",
    project_id="proj_456",
    old_name="high_value_customers",
    new_name="premium_customers"
)

# Delete concepts
client.concepts.delete(
    workspace_id="ws_123",
    project_id="proj_456",
    concept_names=["old_concept", "unused_concept"]
)
```

### Data Sources

```python
# Connect data sources
sources = [
    {
        "type": "database",
        "name": "customer_db",
        "connection_config": {
            "host": "db.example.com",
            "port": 5432,
            "database": "customers",
            "username": "user",
            "password": "password"
        }
    }
]

client.data_sources.connect(workspace_id="ws_123", sources=sources)

# List data sources
sources = client.data_sources.list(workspace_id="ws_123")

# Sync data sources
sync_result = client.data_sources.sync(
    workspace_id="ws_123",
    source_ids=["source_123"],
    sync_options={"incremental": True}
)

# Test connection
test_result = client.data_sources.test_connection(
    workspace_id="ws_123",
    source_config={
        "type": "database",
        "connection_config": {
            "host": "db.example.com",
            "port": 5432,
            "database": "test_db"
        }
    }
)
```

### Knowledge Graphs

```python
# Save knowledge graph
concepts = [
    {
        "name": "Customer",
        "properties": ["id", "name", "email"],
        "description": "Customer entity"
    },
    {
        "name": "Product",
        "properties": ["id", "name", "price"],
        "description": "Product entity"
    }
]

relationships = [
    {
        "from": "Customer",
        "to": "Product",
        "type": "purchases",
        "properties": ["date", "quantity"]
    }
]

client.knowledge_graphs.save(
    workspace_id="ws_123",
    project_id="proj_456",
    concepts=concepts,
    relationships=relationships
)

# Load knowledge graph
kg = client.knowledge_graphs.get(
    workspace_id="ws_123",
    project_id="proj_456"
)

# Query knowledge graph
results = client.knowledge_graphs.query(
    workspace_id="ws_123",
    project_id="proj_456",
    query="SELECT ?customer ?product WHERE { ?customer purchases ?product }",
    limit=100
)

# Export knowledge graph
export_data = client.knowledge_graphs.export(
    workspace_id="ws_123",
    project_id="proj_456",
    format="rdf"
)
```

### Vadalog

```python
# Evaluate Vadalog program
program = """
@input("sales_data").
@output("monthly_totals").
monthly_totals(Month, Total) :- 
    sales_data(Date, Amount),
    extract_month(Date, Month),
    sum(Amount, Month, Total).
"""

result = client.vadalog.evaluate(
    program=program,
    parameters={"year": 2024},
    execution_options={
        "step_by_step": False,
        "materialize_intermediate": True
    }
)

# Validate program
validation = client.vadalog.validate(
    program=program,
    strict_mode=True
)

# Stop evaluation
client.vadalog.stop()

# Get execution status
status = client.vadalog.get_status(execution_id="exec_123")

# List built-in functions
functions = client.vadalog.list_functions(category="math")

# Explain program
explanation = client.vadalog.explain(
    program=program,
    explanation_type="detailed"
)
```

### Notebooks

```python
# Save notebook cell
cell = client.notebooks.save_cell(
    workspace_id="ws_123",
    project_id="proj_456",
    notebook_id="analysis_notebook",
    cell_position=1,
    cell_content="""
    @input("customer_data").
    @output("customer_segments").
    customer_segments(Segment, Count) :- 
        customer_data(Customer, Age, Income),
        classify_segment(Age, Income, Segment),
        count(Customer, Segment, Count).
    """,
    cell_description="Customer segmentation analysis"
)

# Load notebook
notebook = client.notebooks.get(
    workspace_id="ws_123",
    project_id="proj_456",
    notebook_id="analysis_notebook"
)

# Execute cell
result = client.notebooks.execute_cell(
    workspace_id="ws_123",
    project_id="proj_456",
    cell_id="cell_123",
    parameters={"segment_threshold": 5}
)

# List notebooks
notebooks = client.notebooks.list(
    workspace_id="ws_123",
    project_id="proj_456"
)

# Export notebook
export_data = client.notebooks.export(
    workspace_id="ws_123",
    project_id="proj_456",
    notebook_id="analysis_notebook",
    format="ipynb"
)
```

### Users

```python
# Get user role
role = client.users.get_role()

# Save user configuration
client.users.save_config(
    config_data={
        "theme": "dark",
        "language": "en",
        "notifications": True
    }
)

# Load user configuration
config = client.users.load_config()

# Get usage status
usage = client.users.get_usage_status()
print(f"LLM usage: {usage.llm_usage.current}/{usage.llm_usage.limit}")
```

## Error Handling

The SDK provides structured error handling:

```python
from prometheux_sdk import PrometheuxClient, PrometheuxError, AuthenticationError

try:
    client = PrometheuxClient(base_url="...", token="invalid_token")
    result = client.concepts.run(...)
except AuthenticationError as e:
    print(f"Authentication failed: {e.message}")
except PrometheuxError as e:
    print(f"API error: {e.message}")
    print(f"Status code: {e.status_code}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

## Async Support

The SDK also supports async operations:

```python
import asyncio
from prometheux_sdk import AsyncPrometheuxClient

async def main():
    client = AsyncPrometheuxClient(base_url="...", token="...")
    
    # All methods are available as async
    workspace = await client.workspaces.create(name="Async Workspace")
    result = await client.concepts.run(
        workspace_id=workspace.id,
        project_id="proj_123",
        concept_name="analysis"
    )
    
    print(f"Result: {result.data}")

asyncio.run(main())
```

## Configuration

You can configure the SDK using environment variables:

```bash
export PROMETHEUX_BASE_URL="https://platform.prometheux.ai/jarvispy/org/user/api/v1"
export PROMETHEUX_TOKEN="your_jwt_token"
export PROMETHEUX_TIMEOUT=30
```

Then initialize without parameters:

```python
from prometheux_sdk import PrometheuxClient

# Will use environment variables
client = PrometheuxClient()
```

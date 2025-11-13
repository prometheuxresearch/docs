---
slug: /api/endpoints/concepts
---

# Concepts API

The Concepts API allows you to manage and execute Vadalog concepts within projects. This is one of the core APIs for working with logical reasoning and data analysis.

## Save Concept

Save or update a concept with Vadalog logic and optional Python scripts.

### HTTP Request

```bash
POST /api/v1/concepts/{workspace_id}/{project_id}/save
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| concept_logic | string | Yes | Vadalog program/annotations |
| scope | string | No | Concept scope (default: "user") |
| python_scripts | object | No | Python scripts as name->code pairs |

### cURL Example

```bash
curl -X POST "https://api.prometheux.ai/jarvispy/my-org/my-user/api/v1/concepts/workspace_id/1921d58a6g2/save" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "concept_logic": "@input(\"products\").\n@output(\"ordered_products\").\nordered_products(Product, Price) :- products(Product, Price), Price > 100.",
    "scope": "user",
    "python_scripts": {
      "data_processor": "def process_data(df):\n    return df.sort_values(\"price\")"
    }
  }'
```

### Python Example

```python
def save_concept(base_url, token, workspace_id, project_id, concept_logic, 
                scope="user", python_scripts=None):
    """Save a concept with Vadalog logic."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "concept_logic": concept_logic,
        "scope": scope,
        "python_scripts": python_scripts or {}
    }
    
    url = f"{base_url}/concepts/{workspace_id}/{project_id}/save"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
vadalog_code = """
@input("products").
@output("ordered_products").
ordered_products(Product, Price) :- products(Product, Price), Price > 100.
"""

python_scripts = {
    "data_processor": "def process_data(df):\n    return df.sort_values('price')"
}

result = save_concept(base_url, token, "workspace_id", "1921d58a6g2", 
                     vadalog_code, python_scripts=python_scripts)
print(result['message'])
```

## Run Concept

Execute a concept with specified parameters. This is the main endpoint for running Vadalog logic.

### HTTP Request

```bash
POST /api/v1/concepts/{workspace_id}/{project_id}/run
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| concept_name | string | Yes | Name of the concept to execute |
| params | object | No | Parameters to pass to the concept |
| force_rerun | boolean | No | Force re-execution (default: true) |
| persist_outputs | boolean | No | Persist execution outputs (default: false) |
| project_scope | string | No | Project scope (default: "user") |
| step_by_step | boolean | No | Enable step-by-step execution (default: false) |
| materialize_intermediate_concepts | boolean | No | Materialize intermediate results (default: false) |

### cURL Example

```bash
curl -X POST "https://api.prometheux.ai/jarvispy/my-org/my-user/api/v1/concepts/workspace_id/1921d58a6g2/run" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9uMmVIoNF4TNx25UeSKF0ewTo7KtnufYyZSX9OaKsyu0" \
  -d '{
    "concept_name": "shortest_routes"
  }'
```

### Python Example

```python
import requests

def run_concept(base_url, token, workspace_id, project_id, concept_name, 
                params=None, force_rerun=True, persist_outputs=False, 
                project_scope="user", step_by_step=False, 
                materialize_intermediate_concepts=False):
    """Execute a concept in a project."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "concept_name": concept_name,
        "params": params or {},
        "force_rerun": force_rerun,
        "persist_outputs": persist_outputs,
        "project_scope": project_scope,
        "step_by_step": step_by_step,
        "materialize_intermediate_concepts": materialize_intermediate_concepts
    }
    
    url = f"{base_url}/concepts/{workspace_id}/{project_id}/run"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
result = run_concept(
    base_url, 
    token, 
    "workspace_id", 
    "1921d58a6g2", 
    "ordered_bom",
    params={"limit": 100}
)
print(f"Concept executed: {result['message']}")
print(f"Results: {result['data']}")
```

### Response

```json
{
  "data": {
    "execution_id": "exec_12345",
    "results": [...],
    "execution_time": 1.23,
    "rows_processed": 1500
  },
  "message": "Concept executed successfully",
  "status": "success"
}
```

## List Concepts

List all concepts in a project.

### HTTP Request

```bash
GET /api/v1/concepts/{workspace_id}/{project_id}/list?scope=user
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| scope | string | No | Concept scope (default: "user") |

### cURL Example

```bash
curl -X GET "https://api.prometheux.ai/jarvispy/my-org/my-user/api/v1/concepts/workspace_id/1921d58a6g2/list?scope=user" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def list_concepts(base_url, token, workspace_id, project_id, scope="user"):
    """List all concepts in a project."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"scope": scope}
    
    url = f"{base_url}/concepts/{workspace_id}/{project_id}/list"
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
concepts = list_concepts(base_url, token, "workspace_id", "1921d58a6g2")
for concept in concepts['data']:
    print(f"Concept: {concept['predicate_name']} ({concept['row_count']} rows)")
```

## Cleanup Concepts

Delete concepts from a project.

### HTTP Request

```bash
POST /api/v1/concepts/{workspace_id}/{project_id}/cleanup
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| scope | string | No | Concept scope (default: "user") |
| concept_names | array | No | Specific concept names to delete (if not provided, deletes all) |

### cURL Example

```bash
curl -X POST "https://api.prometheux.ai/jarvispy/my-org/my-user/api/v1/concepts/workspace_id/1921d58a6g2/cleanup" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "scope": "user",
    "concept_names": ["ordered_bom", "product_analysis"]
  }'
```

### Python Example

```python
def cleanup_concepts(base_url, token, workspace_id, project_id, 
                    scope="user", concept_names=None):
    """Delete concepts from a project."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {"scope": scope}
    if concept_names:
        data["concept_names"] = concept_names
    
    url = f"{base_url}/concepts/{workspace_id}/{project_id}/cleanup"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
# Delete specific concepts
result = cleanup_concepts(base_url, token, "workspace_id", "1921d58a6g2", 
                         concept_names=["ordered_bom", "product_analysis"])

# Delete all concepts
result = cleanup_concepts(base_url, token, "workspace_id", "1921d58a6g2")
print(result['message'])
```

## Rename Concept

Rename an existing concept.

### HTTP Request

```bash
POST /api/v1/concepts/{workspace_id}/{project_id}/rename
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| name | string | Yes | Current concept name |
| new_name | string | Yes | New concept name |
| scope | string | No | Concept scope (default: "user") |

### cURL Example

```bash
curl -X POST "https://api.prometheux.ai/jarvispy/my-org/my-user/api/v1/concepts/workspace_id/1921d58a6g2/rename" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "old_concept_name",
    "new_name": "new_concept_name",
    "scope": "user"
  }'
```

### Python Example

```python
def rename_concept(base_url, token, workspace_id, project_id, 
                  old_name, new_name, scope="user"):
    """Rename a concept."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "name": old_name,
        "new_name": new_name,
        "scope": scope
    }
    
    url = f"{base_url}/concepts/{workspace_id}/{project_id}/rename"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
result = rename_concept(base_url, token, "workspace_id", "1921d58a6g2", 
                       "old_concept_name", "new_concept_name")
print(result['message'])
```

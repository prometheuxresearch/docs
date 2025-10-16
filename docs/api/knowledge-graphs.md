# Knowledge Graphs API

The Knowledge Graphs API allows you to create, manage, and query virtual knowledge graphs within your projects.

## Save Knowledge Graph

Save or update a virtual knowledge graph for a project.

### HTTP Request

```bash
POST /api/v1/kgs/{workspace_id}/{project_id}/save
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| virtual_kg | object | Yes | Virtual knowledge graph data |
| project | object | No | Project metadata |

The virtual_kg object should contain:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| concepts | array | Yes | Array of concept definitions |
| relationships | array | No | Array of relationship definitions |
| metadata | object | No | Additional metadata |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/kgs/workspace_id/project_id/save" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "project": {
      "scope": "user"
    },
    "virtual_kg": {
      "concepts": [
        {
          "name": "Customer",
          "properties": ["id", "name", "email", "age"],
          "description": "Customer entity"
        },
        {
          "name": "Product",
          "properties": ["id", "name", "price", "category"],
          "description": "Product entity"
        }
      ],
      "relationships": [
        {
          "from": "Customer",
          "to": "Product",
          "type": "purchases",
          "properties": ["date", "quantity"]
        }
      ]
    }
  }'
```

### Python Example

```python
import requests

def save_knowledge_graph(base_url, token, workspace_id, project_id, 
                        concepts, relationships=None, project_scope="user"):
    """Save a virtual knowledge graph."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "project": {"scope": project_scope},
        "virtual_kg": {
            "concepts": concepts,
            "relationships": relationships or []
        }
    }
    
    url = f"{base_url}/kgs/{workspace_id}/{project_id}/save"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
concepts = [
    {
        "name": "Customer",
        "properties": ["id", "name", "email", "age"],
        "description": "Customer entity"
    },
    {
        "name": "Product", 
        "properties": ["id", "name", "price", "category"],
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

result = save_knowledge_graph(base_url, token, "workspace_id", "project_id", 
                             concepts, relationships)
print(result['message'])
```

## Load Knowledge Graph

Load a virtual knowledge graph for a project.

### HTTP Request

```bash
GET /api/v1/kgs/{workspace_id}/{project_id}/load?scope=user
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| scope | string | No | Knowledge graph scope (default: "user") |

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/kgs/workspace_id/project_id/load?scope=user" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def load_knowledge_graph(base_url, token, workspace_id, project_id, scope="user"):
    """Load a virtual knowledge graph."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"scope": scope}
    
    url = f"{base_url}/kgs/{workspace_id}/{project_id}/load"
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
kg = load_knowledge_graph(base_url, token, "workspace_id", "project_id")
print(f"Knowledge graph for project: {kg['data']['project_id']}")
print(f"Number of concepts: {len(kg['data']['concepts'])}")
for concept in kg['data']['concepts']:
    print(f"  - {concept['name']}: {concept['description']}")
```

### Response

```json
{
  "data": {
    "project_id": "project_id",
    "concepts": [
      {
        "name": "Customer",
        "properties": ["id", "name", "email", "age"],
        "description": "Customer entity"
      }
    ],
    "relationships": [
      {
        "from": "Customer",
        "to": "Product",
        "type": "purchases",
        "properties": ["date", "quantity"]
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "author": "user"
  },
  "message": "Knowledge graph loaded successfully",
  "status": "success"
}
```

## Query Knowledge Graph

Execute queries against the virtual knowledge graph.

### HTTP Request

```bash
POST /api/v1/kgs/{workspace_id}/{project_id}/query
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| query | string | Yes | Query string (SPARQL or custom format) |
| query_type | string | No | Query type (default: "sparql") |
| scope | string | No | Knowledge graph scope (default: "user") |
| limit | integer | No | Maximum number of results (default: 100) |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/kgs/workspace_id/project_id/query" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "SELECT ?customer ?product WHERE { ?customer purchases ?product }",
    "query_type": "sparql",
    "scope": "user",
    "limit": 50
  }'
```

### Python Example

```python
def query_knowledge_graph(base_url, token, workspace_id, project_id, query, 
                         query_type="sparql", scope="user", limit=100):
    """Query a virtual knowledge graph."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "query": query,
        "query_type": query_type,
        "scope": scope,
        "limit": limit
    }
    
    url = f"{base_url}/kgs/{workspace_id}/{project_id}/query"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
query = "SELECT ?customer ?product WHERE { ?customer purchases ?product }"
results = query_knowledge_graph(base_url, token, "workspace_id", "project_id", query)

print(f"Query returned {len(results['data']['results'])} results")
for result in results['data']['results']:
    print(f"Customer: {result['customer']}, Product: {result['product']}")
```

## Export Knowledge Graph

Export a knowledge graph in various formats.

### HTTP Request

```bash
POST /api/v1/kgs/{workspace_id}/{project_id}/export
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| format | string | No | Export format: "rdf", "json", "cypher" (default: "json") |
| scope | string | No | Knowledge graph scope (default: "user") |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/kgs/workspace_id/project_id/export" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "format": "rdf",
    "scope": "user"
  }'
```

### Python Example

```python
def export_knowledge_graph(base_url, token, workspace_id, project_id, 
                          format="json", scope="user"):
    """Export a knowledge graph in specified format."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "format": format,
        "scope": scope
    }
    
    url = f"{base_url}/kgs/{workspace_id}/{project_id}/export"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
# Export as RDF
rdf_export = export_knowledge_graph(base_url, token, "workspace_id", "project_id", "rdf")
print("RDF Export:")
print(rdf_export['data']['content'])

# Export as JSON
json_export = export_knowledge_graph(base_url, token, "workspace_id", "project_id", "json")
print("JSON Export:")
print(json_export['data'])
```

## Visualize Knowledge Graph

Generate visualization data for the knowledge graph.

### HTTP Request

```bash
GET /api/v1/kgs/{workspace_id}/{project_id}/visualize?scope=user&layout=force
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| scope | string | No | Knowledge graph scope (default: "user") |
| layout | string | No | Layout algorithm: "force", "hierarchical", "circular" (default: "force") |
| include_data | boolean | No | Include sample data in visualization (default: false) |

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/kgs/workspace_id/project_id/visualize?scope=user&layout=force&include_data=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def visualize_knowledge_graph(base_url, token, workspace_id, project_id, 
                             scope="user", layout="force", include_data=False):
    """Get visualization data for a knowledge graph."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {
        "scope": scope,
        "layout": layout,
        "include_data": include_data
    }
    
    url = f"{base_url}/kgs/{workspace_id}/{project_id}/visualize"
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
viz_data = visualize_knowledge_graph(base_url, token, "workspace_id", "project_id", 
                                   layout="hierarchical", include_data=True)

print("Visualization nodes:")
for node in viz_data['data']['nodes']:
    print(f"  - {node['id']}: {node['label']} ({node['type']})")

print("Visualization edges:")
for edge in viz_data['data']['edges']:
    print(f"  - {edge['source']} -> {edge['target']} ({edge['type']})")
```

---
slug: /api/endpoints/data
---

# Data API

The Data API allows you to connect, manage, and query external data sources within your workspaces.

## Connect Data Source

Connect an external database to a workspace.

### HTTP Request

```bash
POST /api/v1/data/{workspace_id}/connect
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| scope | string | No | Data source scope (default: "user") |
| database | object | Yes | Database connection configuration |
| computeRowCount | boolean | No | Compute row counts for tables (default: false) |

The database object should contain:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| databaseType | string | Yes | Database type (e.g., "postgresql", "mysql", "mongodb") |
| host | string | Yes | Database host |
| port | integer | Yes | Database port |
| database | string | Yes | Database name |
| username | string | Yes | Database username |
| password | string | Yes | Database password |
| name | string | No | Custom name for the connection |

### cURL Example

```bash
curl -X POST "https://api.prometheux.ai/jarvispy/my-org/my-user/api/v1/data/workspace_id/connect" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "scope": "user",
    "database": {
      "databaseType": "postgresql",
      "host": "db.example.com",
      "port": 5432,
      "database": "customers",
      "username": "user",
      "password": "password",
      "name": "Customer Database"
    },
    "computeRowCount": true
  }'
```

### Python Example

```python
import requests

def connect_database(base_url, token, workspace_id, database_config, 
                    scope="user", compute_row_count=False):
    """Connect a database to a workspace."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "scope": scope,
        "database": database_config,
        "computeRowCount": compute_row_count
    }
    
    url = f"{base_url}/data/{workspace_id}/connect"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
database = {
    "databaseType": "postgresql",
    "host": "db.example.com",
    "port": 5432,
    "database": "customers",
    "username": "user",
    "password": "password",
    "name": "Customer Database"
}

result = connect_database(base_url, token, "workspace_id", database, compute_row_count=True)
if result['data']['connectionStatus']:
    print("Database connected successfully!")
    print(f"Found {len(result['data']['sources'])} tables")
else:
    print(f"Connection failed: {result['data']['errorMessage']}")
```

### Response

```json
{
  "data": {
    "connectionStatus": true,
    "sources": [
      {
        "id": "source_123",
        "name": "customers",
        "type": "table",
        "row_count": 1500
      }
    ],
    "errorMessage": null
  },
  "message": "Database connection successful",
  "status": "success"
}
```

## List Data Sources

List all connected data sources in a workspace.

### HTTP Request

```bash
GET /api/v1/data/{workspace_id}/list?scope=user
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| scope | string | No | Data source scope (default: "user") |

### cURL Example

```bash
curl -X GET "https://api.prometheux.ai/jarvispy/my-org/my-user/api/v1/data/workspace_id/list?scope=user" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def list_data_sources(base_url, token, workspace_id, scope="user"):
    """List all data sources in a workspace."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"scope": scope}
    
    url = f"{base_url}/data/{workspace_id}/list"
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
sources = list_data_sources(base_url, token, "workspace_id")
for source in sources['data']:
    print(f"Data source: {source['name']} (Type: {source['type']})")
```

## Cleanup Data Sources

Remove data sources from a workspace.

### HTTP Request

```bash
POST /api/v1/data/{workspace_id}/cleanup
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| scope | string | No | Data source scope (default: "user") |
| source_ids | array | No | Specific source IDs to delete (if not provided, deletes all) |

### cURL Example

```bash
curl -X POST "https://api.prometheux.ai/jarvispy/my-org/my-user/api/v1/data/workspace_id/cleanup" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "scope": "user",
    "source_ids": ["source_123", "source_456"]
  }'
```

### Python Example

```python
def cleanup_data_sources(base_url, token, workspace_id, scope="user", source_ids=None):
    """Remove data sources from a workspace."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {"scope": scope}
    if source_ids:
        data["source_ids"] = source_ids
    
    url = f"{base_url}/data/{workspace_id}/cleanup"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
# Delete specific sources
result = cleanup_data_sources(base_url, token, "workspace_id", 
                             source_ids=["source_123", "source_456"])

# Delete all sources
result = cleanup_data_sources(base_url, token, "workspace_id")
print(result['message'])
```

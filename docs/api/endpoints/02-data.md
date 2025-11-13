---
slug: /api/endpoints/data
---

# Data API

The Data API allows you to connect, manage, and synchronize external data sources within your workspaces.

## Connect Data Sources

Connect external data sources to a workspace.

### HTTP Request

```bash
POST /api/v1/data/{workspace_id}/connect
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| scope | string | No | Data source scope (default: "user") |
| sources | array | Yes | Array of data source configurations |

Each source object should contain:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Data source type (e.g., "database", "api", "file") |
| name | string | Yes | Data source name |
| connection_config | object | Yes | Connection configuration |
| metadata | object | No | Additional metadata |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/data/workspace_id/connect" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "scope": "user",
    "sources": [
      {
        "type": "database",
        "name": "customer_db",
        "connection_config": {
          "host": "db.example.com",
          "port": 5432,
          "database": "customers",
          "username": "user",
          "password": "password"
        },
        "metadata": {
          "description": "Customer database connection"
        }
      }
    ]
  }'
```

### Python Example

```python
import requests

def connect_data_sources(base_url, token, workspace_id, sources, scope="user"):
    """Connect data sources to a workspace."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "scope": scope,
        "sources": sources
    }
    
    url = f"{base_url}/data/{workspace_id}/connect"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
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
        },
        "metadata": {
            "description": "Customer database connection"
        }
    },
    {
        "type": "api",
        "name": "sales_api",
        "connection_config": {
            "base_url": "https://api.sales.com",
            "api_key": "your_api_key"
        }
    }
]

result = connect_data_sources(base_url, token, "workspace_id", sources)
print(f"Connected {len(result['data']['connected_sources'])} data sources")
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
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/data/workspace_id/list?scope=user" \
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

## Sync Data Sources

Synchronize data from connected sources.

### HTTP Request

```bash
POST /api/v1/data/{workspace_id}/sync
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| scope | string | No | Data source scope (default: "user") |
| source_ids | array | No | Specific source IDs to sync (if not provided, syncs all) |
| sync_options | object | No | Synchronization options |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/data/workspace_id/sync" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "scope": "user",
    "source_ids": ["source_123", "source_456"],
    "sync_options": {
      "incremental": true,
      "batch_size": 1000
    }
  }'
```

### Python Example

```python
def sync_data_sources(base_url, token, workspace_id, scope="user", 
                     source_ids=None, sync_options=None):
    """Synchronize data from connected sources."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {"scope": scope}
    if source_ids:
        data["source_ids"] = source_ids
    if sync_options:
        data["sync_options"] = sync_options
    
    url = f"{base_url}/data/{workspace_id}/sync"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
sync_options = {
    "incremental": True,
    "batch_size": 1000
}

result = sync_data_sources(base_url, token, "workspace_id", 
                          source_ids=["source_123"], 
                          sync_options=sync_options)
print(f"Synced {result['data']['records_processed']} records")
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
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/data/workspace_id/cleanup" \
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

## Test Data Source Connection

Test the connection to a data source before saving it.

### HTTP Request

```bash
POST /api/v1/data/{workspace_id}/test-connection
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| source_config | object | Yes | Data source configuration to test |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/data/workspace_id/test-connection" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "source_config": {
      "type": "database",
      "connection_config": {
        "host": "db.example.com",
        "port": 5432,
        "database": "customers",
        "username": "user",
        "password": "password"
      }
    }
  }'
```

### Python Example

```python
def test_data_source_connection(base_url, token, workspace_id, source_config):
    """Test a data source connection."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {"source_config": source_config}
    
    url = f"{base_url}/data/{workspace_id}/test-connection"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
source_config = {
    "type": "database",
    "connection_config": {
        "host": "db.example.com",
        "port": 5432,
        "database": "customers",
        "username": "user",
        "password": "password"
    }
}

result = test_data_source_connection(base_url, token, "workspace_id", source_config)
if result['status'] == 'success':
    print("Connection test successful!")
else:
    print(f"Connection test failed: {result['message']}")
```

## Get Data Source Schema

Retrieve the schema information for a connected data source.

### HTTP Request

```bash
GET /api/v1/data/{workspace_id}/schema?source_id={source_id}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| source_id | string | Yes | The data source ID |
| scope | string | No | Data source scope (default: "user") |

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/data/workspace_id/schema?source_id=source_123&scope=user" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def get_data_source_schema(base_url, token, workspace_id, source_id, scope="user"):
    """Get schema information for a data source."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"source_id": source_id, "scope": scope}
    
    url = f"{base_url}/data/{workspace_id}/schema"
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
schema = get_data_source_schema(base_url, token, "workspace_id", "source_123")
for table in schema['data']['tables']:
    print(f"Table: {table['name']}")
    for column in table['columns']:
        print(f"  - {column['name']} ({column['type']})")
```

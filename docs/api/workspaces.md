# Workspaces API

The Workspaces API allows you to create, manage, and organize workspaces within the Prometheux platform.

## Save Workspace

Create or update a workspace.

### HTTP Request

```bash
POST /api/v1/workspaces/save
```

### Parameters

The request body should contain the workspace data object with the following structure:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | No | Workspace ID (auto-generated if not provided) |
| name | string | Yes | Workspace name |
| description | string | No | Workspace description |
| metadata | object | No | Additional workspace metadata |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/workspaces/save" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Financial Analysis Workspace",
    "description": "Workspace for financial data analysis and reporting",
    "metadata": {
      "department": "finance",
      "created_by": "analyst_team"
    }
  }'
```

### Python Example

```python
import requests

def save_workspace(base_url, token, workspace_data):
    """Create or update a workspace."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(f"{base_url}/workspaces/save", 
                           headers=headers, json=workspace_data)
    return response.json()

# Usage
workspace = {
    "name": "Financial Analysis Workspace",
    "description": "Workspace for financial data analysis and reporting",
    "metadata": {
        "department": "finance",
        "created_by": "analyst_team"
    }
}

result = save_workspace(base_url, token, workspace)
print(f"Workspace created with ID: {result['data']['workspace_id']}")
```

### Response

```json
{
  "data": {
    "workspace_id": "ws_12345"
  },
  "message": "Workspace saved successfully",
  "status": "success"
}
```

## List Workspaces

Retrieve all workspaces accessible to the current user.

### HTTP Request

```bash
GET /api/v1/workspaces/list?scope=user
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| scope | string | No | Scope of workspaces to list (default: "user") |

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/workspaces/list?scope=user" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def list_workspaces(base_url, token, scope="user"):
    """List all accessible workspaces."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"scope": scope}
    
    response = requests.get(f"{base_url}/workspaces/list", 
                          headers=headers, params=params)
    return response.json()

# Usage
workspaces = list_workspaces(base_url, token)
for workspace in workspaces['data']:
    print(f"Workspace: {workspace['name']} (ID: {workspace['id']})")
```

## Load Workspace

Load a specific workspace by ID.

### HTTP Request

```bash
GET /api/v1/workspaces/{workspace_id}/load?scope=user
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| scope | string | No | Workspace scope (default: "user") |

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/workspaces/ws_12345/load?scope=user" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def load_workspace(base_url, token, workspace_id, scope="user"):
    """Load a specific workspace."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"scope": scope}
    
    response = requests.get(f"{base_url}/workspaces/{workspace_id}/load", 
                          headers=headers, params=params)
    return response.json()

# Usage
workspace = load_workspace(base_url, token, "ws_12345")
print(f"Loaded workspace: {workspace['data']['name']}")
```

## Export Workspace Tables

Export all tables from a workspace including projects and workspace-level data.

### HTTP Request

```bash
POST /api/v1/workspaces/{workspace_id}/export-tables
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| scope | string | No | Export scope (default: "user") |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/workspaces/ws_12345/export-tables" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "scope": "user"
  }'
```

### Python Example

```python
def export_workspace_tables(base_url, token, workspace_id, scope="user"):
    """Export all tables from a workspace."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {"scope": scope}
    
    response = requests.post(f"{base_url}/workspaces/{workspace_id}/export-tables", 
                           headers=headers, json=data)
    return response.json()

# Usage
export_data = export_workspace_tables(base_url, token, "ws_12345")
print(f"Exported {export_data['data']['summary']['total_tables']} tables")
```

## Import Workspace Tables

Import previously exported workspace data.

### HTTP Request

```bash
POST /api/v1/workspaces/import-tables
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| export_data | object | Yes | Previously exported workspace data |
| workspace_id | string | Yes | Target workspace ID |
| scope | string | No | Import scope (default: "user") |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/workspaces/import-tables" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "export_data": {...},
    "workspace_id": "ws_67890",
    "scope": "user"
  }'
```

### Python Example

```python
def import_workspace_tables(base_url, token, export_data, workspace_id, scope="user"):
    """Import workspace tables from exported data."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "export_data": export_data,
        "workspace_id": workspace_id,
        "scope": scope
    }
    
    response = requests.post(f"{base_url}/workspaces/import-tables", 
                           headers=headers, json=data)
    return response.json()

# Usage
# Assuming you have export_data from a previous export
result = import_workspace_tables(base_url, token, export_data, "ws_67890")
print(f"Imported {result['data']['summary']['projects_imported']} projects")
```

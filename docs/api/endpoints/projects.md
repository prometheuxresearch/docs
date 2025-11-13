# Projects API

The Projects API allows you to manage projects within workspaces, including creation, import/export, and template management.

## Save Project

Create or update a project in a workspace.

### HTTP Request

```bash
POST /api/v1/projects/{workspace_id}/save
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project | object | Yes | Project data object |

The project object should contain:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | No | Project ID (auto-generated if not provided) |
| name | string | Yes | Project name |
| description | string | No | Project description |
| metadata | object | No | Additional project metadata |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/projects/workspace_id/save" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "project": {
      "name": "Financial Risk Analysis",
      "description": "Project for analyzing financial risk factors",
      "metadata": {
        "department": "risk_management",
        "priority": "high"
      }
    }
  }'
```

### Python Example

```python
import requests

def save_project(base_url, token, workspace_id, project_data):
    """Create or update a project."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {"project": project_data}
    
    url = f"{base_url}/projects/{workspace_id}/save"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
project = {
    "name": "Financial Risk Analysis",
    "description": "Project for analyzing financial risk factors",
    "metadata": {
        "department": "risk_management",
        "priority": "high"
    }
}

result = save_project(base_url, token, "workspace_id", project)
print(f"Project saved with ID: {result['data']['project_id']}")
```

## List Projects

List all projects in a workspace.

### HTTP Request

```bash
GET /api/v1/projects/{workspace_id}/list?scopes=user
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| scopes | string | No | Comma-separated list of scopes (default: "user") |

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/projects/workspace_id/list?scopes=user,organization" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def list_projects(base_url, token, workspace_id, scopes="user"):
    """List all projects in a workspace."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"scopes": scopes}
    
    url = f"{base_url}/projects/{workspace_id}/list"
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
projects = list_projects(base_url, token, "workspace_id", "user,organization")
for project in projects['data']:
    print(f"Project: {project['name']} (ID: {project['id']})")
```

## Load Project

Load a specific project by ID.

### HTTP Request

```bash
GET /api/v1/projects/{workspace_id}/load?project_id={project_id}&scope=user
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID to load |
| scope | string | No | Project scope (default: "user") |

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/projects/workspace_id/load?project_id=proj_12345&scope=user" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def load_project(base_url, token, workspace_id, project_id, scope="user"):
    """Load a specific project."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"project_id": project_id, "scope": scope}
    
    url = f"{base_url}/projects/{workspace_id}/load"
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
project = load_project(base_url, token, "workspace_id", "proj_12345")
print(f"Loaded project: {project['data']['name']}")
```

## Create Project from Context

Create a new project by analyzing text context and optional file attachments using AI.

### HTTP Request

```bash
POST /api/v1/projects/{workspace_id}/create-from-context
```

### Parameters (Form Data)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| context | string | No | Text context describing the domain or task |
| scope | string | No | Project scope (default: "user") |
| files | file[] | No | Optional file attachments (PDF, CSV, TXT, images) |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/projects/workspace_id/create-from-context" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "context=Analyze customer purchase patterns and identify high-value segments for targeted marketing campaigns" \
  -F "scope=user" \
  -F "files=@customer_data.csv" \
  -F "files=@marketing_report.pdf"
```

### Python Example

```python
def create_project_from_context(base_url, token, workspace_id, context, 
                               scope="user", files=None):
    """Create a project from context and files using AI analysis."""
    headers = {"Authorization": f"Bearer {token}"}
    
    data = {
        "context": context,
        "scope": scope
    }
    
    files_data = []
    if files:
        for file_path in files:
            files_data.append(('files', open(file_path, 'rb')))
    
    url = f"{base_url}/projects/{workspace_id}/create-from-context"
    response = requests.post(url, headers=headers, data=data, files=files_data)
    
    # Close file handles
    for _, file_handle in files_data:
        file_handle.close()
    
    return response.json()

# Usage
context = """
Analyze customer purchase patterns and identify high-value segments 
for targeted marketing campaigns. Focus on seasonal trends and 
customer lifetime value calculations.
"""

files = ["customer_data.csv", "marketing_report.pdf"]
result = create_project_from_context(base_url, token, "workspace_id", 
                                   context, files=files)
print(f"Created project: {result['data']['name']}")
```

## Export Project

Export a project including all its data and metadata.

### HTTP Request

```bash
POST /api/v1/projects/{workspace_id}/export-project
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID to export |
| scope | string | No | Export scope (default: "user") |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/projects/workspace_id/export-project" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "project_id": "proj_12345",
    "scope": "user"
  }'
```

### Python Example

```python
def export_project(base_url, token, workspace_id, project_id, scope="user"):
    """Export a project with all its data."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "project_id": project_id,
        "scope": scope
    }
    
    url = f"{base_url}/projects/{workspace_id}/export-project"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
export_data = export_project(base_url, token, "workspace_id", "proj_12345")
print(f"Exported {export_data['data']['summary']['total_tables']} tables")

# Save export data for later import
import json
with open("project_export.json", "w") as f:
    json.dump(export_data['data'], f)
```

## Import Project

Import a previously exported project into a workspace.

### HTTP Request

```bash
POST /api/v1/projects/{workspace_id}/import-project
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The target workspace ID (in URL path) |
| export_data | object | Yes | Previously exported project data |
| scope | string | No | Import scope (default: "user") |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/projects/workspace_id/import-project" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "export_data": {...},
    "scope": "user"
  }'
```

### Python Example

```python
def import_project(base_url, token, workspace_id, export_data, scope="user"):
    """Import a project from exported data."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "export_data": export_data,
        "scope": scope
    }
    
    url = f"{base_url}/projects/{workspace_id}/import-project"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
# Load previously exported data
import json
with open("project_export.json", "r") as f:
    export_data = json.load(f)

result = import_project(base_url, token, "target_workspace_id", export_data)
print(f"Imported project with new ID: {result['data']['new_project_id']}")
```

## Copy Project

Copy a project within or between workspaces.

### HTTP Request

```bash
POST /api/v1/projects/{workspace_id}/copy
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The target workspace ID (in URL path) |
| project_id | string | Yes | Source project ID |
| workspace_id | string | Yes | Source workspace ID |
| new_project_name | string | No | Name for the copied project |
| target_scope | string | No | Target scope (default: "user") |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/projects/target_workspace/copy" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "project_id": "proj_12345",
    "workspace_id": "source_workspace",
    "new_project_name": "Copy of Financial Analysis",
    "target_scope": "user"
  }'
```

### Python Example

```python
def copy_project(base_url, token, target_workspace_id, project_id, 
                source_workspace_id, new_project_name=None, target_scope="user"):
    """Copy a project to another workspace."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "project_id": project_id,
        "workspace_id": source_workspace_id,
        "target_scope": target_scope
    }
    
    if new_project_name:
        data["new_project_name"] = new_project_name
    
    url = f"{base_url}/projects/{target_workspace_id}/copy"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
result = copy_project(base_url, token, "target_workspace", "proj_12345", 
                     "source_workspace", "Copy of Financial Analysis")
print(f"Project copied with new ID: {result['data']['new_project_id']}")
```

## Cleanup Projects

Delete projects from a workspace.

### HTTP Request

```bash
POST /api/v1/projects/{workspace_id}/cleanup
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project | object | No | Project specification for deletion |

The project object can contain:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Specific project ID to delete |
| scope | string | Project scope (default: "user") |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/projects/workspace_id/cleanup" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "project": {
      "id": "proj_12345",
      "scope": "user"
    }
  }'
```

### Python Example

```python
def cleanup_projects(base_url, token, workspace_id, project_id=None, scope="user"):
    """Delete projects from a workspace."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {}
    if project_id:
        data["project"] = {"id": project_id, "scope": scope}
    else:
        data["project"] = {"scope": scope}
    
    url = f"{base_url}/projects/{workspace_id}/cleanup"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
# Delete specific project
result = cleanup_projects(base_url, token, "workspace_id", "proj_12345")

# Delete all user projects
result = cleanup_projects(base_url, token, "workspace_id")
print(result['message'])
```

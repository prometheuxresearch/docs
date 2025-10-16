# Notebooks API

The Notebooks API allows you to manage Jupyter-style notebooks and cells within projects for interactive development and analysis.

## Save Notebook Cell

Create or update a notebook cell with code and metadata.

### HTTP Request

```bash
POST /api/v1/notebooks/{workspace_id}/{project_id}/save-cell
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| notebook_id | string | Yes | Notebook identifier |
| cell_position | integer | Yes | Position of the cell in the notebook |
| cell_content | string | Yes | Cell content (code or markdown) |
| cell_type | string | No | Cell type: "code", "markdown" (default: "code") |
| cell_description | string | No | Cell description |
| cell_id | string | No | Existing cell ID for updates |
| project_scope | string | No | Project scope (default: "user") |
| python_scripts | object | No | Associated Python scripts |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/notebooks/workspace_id/project_id/save-cell" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "notebook_id": "analysis_notebook",
    "cell_position": 1,
    "cell_content": "@input(\"sales_data\").\n@output(\"monthly_sales\").\nmonthly_sales(Month, Total) :- sales_data(Date, Amount), extract_month(Date, Month), sum(Amount, Month, Total).",
    "cell_type": "code",
    "cell_description": "Calculate monthly sales totals",
    "project_scope": "user",
    "python_scripts": {
      "data_processor": "import pandas as pd\ndef process_sales(df):\n    return df.groupby(\"month\").sum()"
    }
  }'
```

### Python Example

```python
import requests

def save_notebook_cell(base_url, token, workspace_id, project_id, notebook_id, 
                      cell_position, cell_content, cell_type="code", 
                      cell_description="", cell_id=None, project_scope="user", 
                      python_scripts=None):
    """Save or update a notebook cell."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "notebook_id": notebook_id,
        "cell_position": cell_position,
        "cell_content": cell_content,
        "cell_type": cell_type,
        "cell_description": cell_description,
        "project_scope": project_scope,
        "python_scripts": python_scripts or {}
    }
    
    if cell_id:
        data["cell_id"] = cell_id
    
    url = f"{base_url}/notebooks/{workspace_id}/{project_id}/save-cell"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
vadalog_code = """
@input("sales_data").
@output("monthly_sales").
monthly_sales(Month, Total) :- 
    sales_data(Date, Amount), 
    extract_month(Date, Month), 
    sum(Amount, Month, Total).
"""

python_scripts = {
    "data_processor": """
import pandas as pd

def process_sales(df):
    df['month'] = pd.to_datetime(df['date']).dt.month
    return df.groupby('month')['amount'].sum()
"""
}

result = save_notebook_cell(
    base_url, token, "workspace_id", "project_id", 
    "analysis_notebook", 1, vadalog_code, 
    cell_description="Calculate monthly sales totals",
    python_scripts=python_scripts
)
print(f"Cell saved with ID: {result['data']['cell_id']}")
```

## Load Notebook

Load all cells from a notebook.

### HTTP Request

```bash
GET /api/v1/notebooks/{workspace_id}/{project_id}/load?notebook_id={notebook_id}&scope=user
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| notebook_id | string | Yes | Notebook identifier |
| scope | string | No | Project scope (default: "user") |

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/notebooks/workspace_id/project_id/load?notebook_id=analysis_notebook&scope=user" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def load_notebook(base_url, token, workspace_id, project_id, notebook_id, scope="user"):
    """Load all cells from a notebook."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"notebook_id": notebook_id, "scope": scope}
    
    url = f"{base_url}/notebooks/{workspace_id}/{project_id}/load"
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
notebook = load_notebook(base_url, token, "workspace_id", "project_id", "analysis_notebook")
print(f"Loaded notebook with {len(notebook['data']['cells'])} cells")
for cell in notebook['data']['cells']:
    print(f"Cell {cell['position']}: {cell['description']}")
```

## Execute Cell

Execute a specific notebook cell.

### HTTP Request

```bash
POST /api/v1/notebooks/{workspace_id}/{project_id}/execute-cell
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| cell_id | string | Yes | Cell ID to execute |
| parameters | object | No | Execution parameters |
| scope | string | No | Project scope (default: "user") |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/notebooks/workspace_id/project_id/execute-cell" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "cell_id": "cell_12345",
    "parameters": {
      "date_range": "2024-01-01,2024-12-31"
    },
    "scope": "user"
  }'
```

### Python Example

```python
def execute_notebook_cell(base_url, token, workspace_id, project_id, cell_id, 
                         parameters=None, scope="user"):
    """Execute a notebook cell."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "cell_id": cell_id,
        "parameters": parameters or {},
        "scope": scope
    }
    
    url = f"{base_url}/notebooks/{workspace_id}/{project_id}/execute-cell"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
parameters = {"date_range": "2024-01-01,2024-12-31"}
result = execute_notebook_cell(base_url, token, "workspace_id", "project_id", 
                              "cell_12345", parameters)
print(f"Cell executed in {result['data']['execution_time']}s")
print(f"Output: {result['data']['output']}")
```

## List Notebooks

List all notebooks in a project.

### HTTP Request

```bash
GET /api/v1/notebooks/{workspace_id}/{project_id}/list?scope=user
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| scope | string | No | Project scope (default: "user") |

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/notebooks/workspace_id/project_id/list?scope=user" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def list_notebooks(base_url, token, workspace_id, project_id, scope="user"):
    """List all notebooks in a project."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"scope": scope}
    
    url = f"{base_url}/notebooks/{workspace_id}/{project_id}/list"
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
notebooks = list_notebooks(base_url, token, "workspace_id", "project_id")
for notebook in notebooks['data']:
    print(f"Notebook: {notebook['notebook_id']} ({notebook['cell_count']} cells)")
```

## Delete Cell

Delete a specific notebook cell.

### HTTP Request

```bash
DELETE /api/v1/notebooks/{workspace_id}/{project_id}/delete-cell
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| cell_id | string | Yes | Cell ID to delete |
| scope | string | No | Project scope (default: "user") |

### cURL Example

```bash
curl -X DELETE "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/notebooks/workspace_id/project_id/delete-cell" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "cell_id": "cell_12345",
    "scope": "user"
  }'
```

### Python Example

```python
def delete_notebook_cell(base_url, token, workspace_id, project_id, cell_id, scope="user"):
    """Delete a notebook cell."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "cell_id": cell_id,
        "scope": scope
    }
    
    url = f"{base_url}/notebooks/{workspace_id}/{project_id}/delete-cell"
    response = requests.delete(url, headers=headers, json=data)
    return response.json()

# Usage
result = delete_notebook_cell(base_url, token, "workspace_id", "project_id", "cell_12345")
print(result['message'])
```

## Export Notebook

Export a notebook in various formats.

### HTTP Request

```bash
POST /api/v1/notebooks/{workspace_id}/{project_id}/export
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| workspace_id | string | Yes | The workspace ID (in URL path) |
| project_id | string | Yes | The project ID (in URL path) |
| notebook_id | string | Yes | Notebook identifier |
| format | string | No | Export format: "ipynb", "html", "pdf", "py" (default: "ipynb") |
| scope | string | No | Project scope (default: "user") |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/notebooks/workspace_id/project_id/export" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "notebook_id": "analysis_notebook",
    "format": "ipynb",
    "scope": "user"
  }'
```

### Python Example

```python
def export_notebook(base_url, token, workspace_id, project_id, notebook_id, 
                   format="ipynb", scope="user"):
    """Export a notebook in specified format."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "notebook_id": notebook_id,
        "format": format,
        "scope": scope
    }
    
    url = f"{base_url}/notebooks/{workspace_id}/{project_id}/export"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
# Export as Jupyter notebook
ipynb_export = export_notebook(base_url, token, "workspace_id", "project_id", 
                              "analysis_notebook", "ipynb")
with open("analysis_notebook.ipynb", "w") as f:
    f.write(ipynb_export['data']['content'])

# Export as Python script
py_export = export_notebook(base_url, token, "workspace_id", "project_id", 
                           "analysis_notebook", "py")
with open("analysis_notebook.py", "w") as f:
    f.write(py_export['data']['content'])

print("Notebook exported successfully")
```

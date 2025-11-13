---
slug: /sdk/python-api/projects
---

# Projects

The `projects` module provides functions for managing projects in the Prometheux platform. It allows you to create, load, list, and clean up projects.

---

## Functions

### save_project

Creates or updates a project in the workspace.

```python
def save_project(workspace_id="workspace_id", project_id=None, project_name=None, project_scope="user")
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `project_id` _(str, optional)_:
  The project identifier. If None, a new project will be created.

- `project_name` _(str, optional)_:
  The name of the project. Required when creating a new project.

- `project_scope` _(str, optional)_:
  The scope of the project. Defaults to "user".

**Returns**
- The project ID of the created or updated project.

**Raises**
- Exception: If an error occurs during project creation or update.

**Example**
```python
import prometheux_chain as px

# Create a new project
project_id = px.save_project(project_name="my_project")

# Update an existing project
updated_project_id = px.save_project(project_id="existing_id", project_name="updated_name")
```

### list_projects

Lists all projects in the workspace.

```python
def list_projects(workspace_id="workspace_id", project_scopes=["user"])
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `project_scopes` _(list, optional)_:
  List of project scopes to filter by. Defaults to ["user"].

**Returns**
- A list of project data dictionaries.

**Raises**
- Exception: If an error occurs while listing projects.

**Example**
```python
import prometheux_chain as px

# List all user projects
projects = px.list_projects()

# List projects with specific scopes
projects = px.list_projects(project_scopes=["user", "shared"])
```

### load_project

Loads a specific project by its ID.

```python
def load_project(project_id, workspace_id="workspace_id", project_scope="user")
```

**Parameters**
- `project_id` _(str)_:
  The project identifier to load.

- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `project_scope` _(str, optional)_:
  The scope of the project. Defaults to "user".

**Returns**
- The project data dictionary.

**Raises**
- Exception: If an error occurs while loading the project.

**Example**
```python
import prometheux_chain as px

# Load a specific project
project_data = px.load_project(project_id="my_project_id")
```

### cleanup_projects

Cleans up project resources for the user.

```python
def cleanup_projects(workspace_id="workspace_id", project_id=None, project_scope="user")
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `project_id` _(str, optional)_:
  The project identifier. If None, cleans up all project resources for the user.

- `project_scope` _(str, optional)_:
  The scope of the project. Defaults to "user".

**Returns**
- None. Prints a success message or raises an exception.

**Raises**
- Exception: If an error occurs during cleanup.

**Example**
```python
import prometheux_chain as px

# Clean up all user projects
px.cleanup_projects()

# Clean up a specific project
px.cleanup_projects(project_id="my_project_id")
```

---

## Complete Workflow Example

```python
import prometheux_chain as px
import os

# Set up authentication and configuration
os.environ['PMTX_TOKEN'] = 'my_pmtx_token'
px.config.set('JARVISPY_URL', "https://api.prometheux.ai/jarvispy/[my_organization]/[my_username]")

# Create a new project
project_id = px.save_project(project_name="test_project")

# List all projects
projects = px.list_projects()
print(f"Available projects: {projects}")

# Load the created project
project_data = px.load_project(project_id)

# Clean up when done
px.cleanup_projects(project_id=project_id)
```

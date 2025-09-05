# Quickstart

This guide demonstrates how to get started with the Prometheux Chain SDK. The example below outlines a typical workflow, including creating a project, defining concept logic, and running concepts to generate results.

---

## Workflow

### Import the `prometheux_chain`
```python
import prometheux_chain as px
import os
```

### Define the PMTX_TOKEN environment variable for authentication
```python
os.environ['PMTX_TOKEN'] = 'my_pmtx_token'
```

### Configure the backend connection using your Prometheux account
```python
px.config.set('JARVISPY_URL', "https://platform.prometheux.ai/jarvispy/[my_organization]/[my_username]")
```

### Create a new project
```python
project_id = px.save_project(project_name="test_project")
```

### Define concept logic using Vadalog syntax and save it
```python
concept_logic = """
company("Apple", "Redwood City, CA").
company("Google", "Mountain View, CA").
company("Microsoft", "Redmond, WA").
company("Amazon", "Seattle, WA").
company("Facebook", "Menlo Park, CA").
company("Twitter", "San Francisco, CA").
company("LinkedIn", "Sunnyvale, CA").
company("Instagram", "Menlo Park, CA").

location(Location) :- company(_,Location).

@output("location").
"""
px.save_concept(project_id=project_id, concept_logic=concept_logic)
```

### Run the concept to generate results
```python
px.run_concept(project_id=project_id, concept_name="location")
```

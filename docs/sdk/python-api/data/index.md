# Data

The `data` module provides functions for managing data sources in the Prometheux platform. It allows you to connect to databases, list sources, and clean up data resources.

---

## Functions

### connect_sources

Connects a data source to a workspace.

```python
def connect_sources(workspace_id="workspace_id", database_payload=None, compute_row_count=False)
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `database_payload` _(dict, optional)_:
  The database connection configuration. Should be a dictionary containing database connection details.

- `compute_row_count` _(bool, optional)_:
  Whether to compute row counts for the connected tables. Defaults to False.

**Returns**
- The connection response data containing source information.

**Raises**
- Exception: If an error occurs during source connection.

**Example**
```python
import prometheux_chain as px

# Create a database configuration
database_config = {
    'databaseType': 'postgresql',
    'username': 'user',
    'password': 'password',
    'host': 'localhost',
    'port': 5432,
    'databaseName': 'mydb',
    'selectedTables': ['users', 'orders']
}

# Connect the source
source_data = px.connect_sources(database_payload=database_config, compute_row_count=True)
```

### list_sources

Lists all data sources in a workspace.

```python
def list_sources(workspace_id="workspace_id")
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

**Returns**
- A list of data source information dictionaries.

**Raises**
- Exception: If an error occurs while listing sources.

**Example**
```python
import prometheux_chain as px

# List all sources in the workspace
sources = px.list_sources()
print(f"Available sources: {sources}")
```

### cleanup_sources

Cleans up data sources for a workspace.

```python
def cleanup_sources(workspace_id="workspace_id", source_ids=None)
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `source_ids` _(list, optional)_:
  List of specific source IDs to clean up. If None, cleans up all sources.

**Returns**
- None. Prints a success message or raises an exception.

**Raises**
- Exception: If an error occurs during cleanup.

**Example**
```python
import prometheux_chain as px

# Clean up all sources
px.cleanup_sources()

# Clean up specific sources
px.cleanup_sources(source_ids=['source1', 'source2'])
```

---

## Database Class

The `Database` class provides a structured way to configure database connections.

### Constructor

```python
class Database(database_type, username, password, host, port, database_name, selected_tables=None, schema=None, catalog=None, query=None, options=None, selected_columns=None, ignore_columns=None, ignore_tables=None)
```

**Parameters**
- `database_type` _(str)_:
  The type of database (e.g., 'postgresql', 'mysql', 'sqlserver').

- `username` _(str)_:
  Database username for authentication.

- `password` _(str)_:
  Database password for authentication.

- `host` _(str)_:
  Database host address.

- `port` _(int)_:
  Database port number.

- `database_name` _(str)_:
  Name of the database to connect to.

- `selected_tables` _(list, optional)_:
  List of specific tables to include. If None, all tables are included.

- `schema` _(str, optional)_:
  Database schema name.

- `catalog` _(str, optional)_:
  Database catalog name.

- `query` _(str, optional)_:
  Custom SQL query to execute.

- `options` _(dict, optional)_:
  Additional database-specific options.

- `selected_columns` _(list, optional)_:
  List of specific columns to include.

- `ignore_columns` _(list, optional)_:
  List of columns to exclude.

- `ignore_tables` _(list, optional)_:
  List of tables to exclude.

### Methods

#### to_dict()

Converts the Database object to a dictionary format suitable for API calls.

**Returns**
- Dictionary representation of the database configuration.

**Example**
```python
import prometheux_chain as px

db = px.Database(
    database_type='postgresql',
    username='user',
    password='password',
    host='localhost',
    port=5432,
    database_name='mydb',
    selected_tables=['users', 'orders']
)

# Convert to dictionary for API call
db_config = db.to_dict()
```

#### from_dict(data)

Class method to create a Database object from a dictionary.

**Parameters**
- `data` _(dict)_:
  Dictionary containing database configuration.

**Returns**
- Database object instance.

**Example**
```python
import prometheux_chain as px

# Create from dictionary
db_data = {
    'databaseType': 'postgresql',
    'host': 'localhost',
    'port': 5432,
    'databaseName': 'mydb',
    'selectedTables': ['users']
}

db = px.Database.from_dict(db_data)
```

---

## Complete Workflow Example

```python
import prometheux_chain as px
import os

# Set up authentication and configuration
os.environ['PMTX_TOKEN'] = 'my_pmtx_token'
px.config.set('JARVISPY_URL', "https://api.prometheux.ai/jarvispy/[my_organization]/[my_username]")

# Create a database configuration using the Database class
database = px.Database(
    database_type='postgresql',
    username='myuser',
    password='mypassword',
    host='localhost',
    port=5432,
    database_name='my_database',
    selected_tables=['customers', 'orders'],
    schema='public'
)

# Connect the database source
source_data = px.connect_sources(database_payload=database.to_dict())

# List all sources
sources = px.list_sources()
print(f"Connected sources: {sources}")

# Clean up when done
px.cleanup_sources()
```

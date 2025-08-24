# Data Exploration API

The `data_exploration` API allows users to discover, filter, and work with database tables. By specifying a database or a data source (optionally with table names, schema, or catalog), users can narrow down which tables should be returned by the API for further data exploration. These APIs construct Vadalog programs that can be directly evaluated to fetch only those tables that have common data in columns.

## Function

```python
def all_pairs_join(databases: list[Database], to_evaluate: bool = True, parallel: bool = False)
```

**Parameters**

- **databases** (`list[Database]`):  
  A list of `Database` objects representing the databases or data sources to be explored.

- **to_evaluate** (`bool`, optional):  
  If `True`, evaluates all the matches and returns an executable Vadalog program with tables in join.  
  If `False`, produces the program that you will have to evaluate, which produces a table with three columns representing table1(columnX), table2(columnY), and #joins. Defaults to `True`.
---

**Returns**

- **str**:  
  Returns a Vadalog program as a string, which can be executed to perform the specified joins.

---

## Examples

### **Example 1: Using PostgreSQL Database**

This example demonstrates how to use the `all_pairs_join` function with a PostgreSQL database.

```python
import prometheux_chain as pmtx
from prometheux_chain.model.database import Database

# Define the PostgreSQL database
db = Database(
    database_type="postgresql",
    username="prometheux",
    password="prometheux",
    host="localhost",
    port=5432,
    database_name="prometheux",
    tables=["public.my_table_1", "public.my_table_2"]
)

# Use the all_pairs_join function
all_pairs_program = pmtx.all_pairs_join([db], to_evaluate=False)

# Save the Vadalog program to a file
vada_file = "all_pairs_program.vada"
with open(vada_file, 'w') as file:
    file.write(all_pairs_program)
```

### **Example 2: Using Databricks with Specific Tables**

This example shows how to use the `all_pairs_join` function with a Databricks cluster, specifying particular tables.

```python
import prometheux_chain as pmtx
from prometheux_chain.model.database import Database

# Define the Databricks database with specific tables
db = Database(
    database_type="databricks",
    username="token",
    password="dapixxx",
    host="dbc-xxxx-02fe.cloud.databricks.com",
    port=443,
    database_name="/sql/1.0/warehouses/3283xxxx",
    schema="my_catalog.my_schema",
    tables=["my_table_1", "my_table_2"]
)

# Use the all_pairs_join function
all_pairs_program = pmtx.all_pairs_join([db], to_evaluate=False)

# Save the Vadalog program to a file
vada_file = "all_pairs_program.vada"
with open(vada_file, 'w') as file:
    file.write(all_pairs_program)
```

### **Example 3: Using Databricks with a Specific Schema**

This example demonstrates how to use the `all_pairs_join` function with a Databricks cluster, specifying a schema.

```python
import prometheux_chain as pmtx
from prometheux_chain.model.database import Database

# Define the Databricks database with a specific schema
db = Database(
    database_type="databricks",
    username="token",
    password="dapixxx",
    host="dbc-xxxx-02fe.cloud.databricks.com",
    port=443,
    database_name="/sql/1.0/warehouses/3283xxxx",
    schema="my_catalog.my_schema"
)

# Use the all_pairs_join function
all_pairs_program = pmtx.all_pairs_join([db], to_evaluate=False)

# Save the Vadalog program to a file
vada_file = "all_pairs_program.vada"
with open(vada_file, 'w') as file:
    file.write(all_pairs_program)
```

### **Example 4: Using PostgreSQL on all tables **

This example demonstrates how to use the `all_pairs_join` function with a PostgreSQL database, specifying all tables.

```python
import prometheux_chain as pmtx
from prometheux_chain.model.database import Database

# Define the PostgreSQL database
db = Database(
    database_type="postgresql",
    username="prometheux",
    password="prometheux",
    host="localhost",
    port=5432,
    database_name="prometheux",
)

# Use the all_pairs_join function
all_pairs_program = pmtx.all_pairs_join([db], to_evaluate=False)

# Save the Vadalog program to a file
vada_file = "all_pairs_program.vada"
with open(vada_file, 'w') as file:
    file.write(all_pairs_program)   
```

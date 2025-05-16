# Rule Inference API

The `rule_inference` API provides functions to infer Vadalog rules from a database or data source schema. It generates a linear Vadalog rule for each table or file and a join rule for each table having foreign keys.

---

## Function

```python
def infer_schema(database, add_bind=True, add_model=False):
```

**Parameters**

- **database** (`Database`):  
  An instance of the `Database` class containing the connection details and configuration for the database or data source.

- **add_bind** (`bool`, optional):  
  Whether to add a **bind** statement in the inferred schema. Defaults to `True`.

- **add_model** (`bool`, optional):  
  Whether to add a model annotation statement in the inferred schema. Defaults to `False`.

---

**Returns**

- **str**:  
  Returns inferred Vadalog rule from database or datasource schema.

---

**Raises**

- **Exception**:  
  If the database or data source is unreachable, or any unexpected error occurs during schema inference.


## Examples

### **Example 1: Inferring Schema from a Neo4j Database**

This example connects to a **Neo4j** database running locally on port **7687** and infers Vadalog rules.

```python
from prometheux_chain.model.database import Database

# Create a Database object for Neo4j
db = Database(
    database_type="neo4j",
    username="neo4j",
    password="neo4j2",
    host="localhost",
    port=7687,
    database_name="neo4j"
)

# Infer Vadalog rules from the Neo4j database
inferred_rules = pmtx.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-neo4j.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 2: Inferring Schema from a CSV File Stored in S3**

This example connects to a **CSV file** stored in an **Amazon S3 bucket** using the `s3a://` protocol.  
It provides additional AWS-related options such as region, endpoint, and credentials provider.

```python
from prometheux_chain.model.database import Database

# Create a Database object for CSV in S3
db = Database(
    database_type="csv",
    username="AKIA4xxxx12",
    password="JyxxxxU+",
    host="s3a://prometheux-data",
    port=None,
    database_name="companies.csv",
    options={
        "region": "eu-west-2", 
        "endpoint": "s3.amazonaws.com",
        "credentials.provider": "org.apache.hadoop.fs.s3a.SimpleAWSCredentialsProvider",
        "delimiter": "\t"
    }
)

# Infer Vadalog rules from the CSV file
inferred_rules = pmtx.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-csv_s3.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 3: Inferring Schema from a PostgreSQL Database**

This example connects to a **PostgreSQL** database running locally on port **5432** and infers Vadalog rules.

```python
from prometheux_chain.model.database import Database

# Create a Database object for PostgreSQL
db = Database(
    database_type="postgresql",
    username="prometheux",
    password="prometheux",
    host="localhost",
    port=5432,
    database_name="prometheux"
)

# Infer Vadalog rules from the PostgreSQL database
inferred_rules = pmtx.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-postgresql.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 4: Inferring Schema from Databricks**

This example connects to a **Databricks** cluster and infers Vadalog rules.

```python
from prometheux_chain.model.database import Database

# Create a Database object for Databricks
db = Database(
    database_type="databricks",
    username="token",
    password="dapixxxx",
    host="dbc-xxxx-02fe.cloud.databricks.com",
    port=443,
    database_name="/sql/1.0/warehouses/3283xxxx"
)

# Infer Vadalog rules from the Databricks cluster
inferred_rules = pmtx.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-databricks.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 5: Inferring Schema from Databricks with table**

This example connects to a **Databricks** cluster and infers Vadalog rule from a specific table.

```python
from prometheux_chain.model.database import Database

# Create a Database object for Databricks with a specific table
db = Database(
    database_type="databricks",
    username="token",
    password="dapixxxx",
    host="dbc-xxxx-02fe.cloud.databricks.com",
    port=443,
    database_name="/sql/1.0/warehouses/3283xxxx",
    tables=["my_catalog.my_schema.my_table"]
)

# Infer Vadalog rules from the Databricks cluster
inferred_rules = pmtx.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-databricks-with-table.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

### **Example 6: Inferring Schema from Databricks with a Specific Schema**

This example connects to a **Databricks** cluster and infers Vadalog rules from a specific schema.

```python
import prometheux_chain as pmtx
from prometheux_chain.model.database import Database

# Infer Vadalog rules from a Databricks cluster with a specific schema
inferred_rules = pmtx.infer_schema(
    Database(
        database_type="databricks",
        username="token",
        password="dapixxxx",
        host="dbc-xxxx-02fe.cloud.databricks.com",
        port=443,
        database_name="/sql/1.0/warehouses/3283xxxx",
        schema="my_catalog.my_schema"
    ),
    add_bind=True,
    add_model=False
)

# Save the inferred rules to a file
vada_file = "infer_schema.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 7: Inferring Schema from Excel File**

Excel files are treated as a dabase where its sheets are considered as tables.
This example connects to an **Excel** file and infers Vadalog rules.

```python
from prometheux_chain.model.database import Database

# Create a Database object for Excel
db = Database(
    database_type="excel",
    username="",
    password="workbookPassword",
    host="path/to/excel_file",
    port=None,
    database_name="excel_file.xlsx",
)

# Infer Vadalog rules from the Excel file
inferred_rules = pmtx.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-excel.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 8: Inferring Schema from a Excel sheet**

This example connects to an **Excel** file and infers Vadalog rules from a specific sheet.

```python
from prometheux_chain.model.database import Database

# Create a Database object for Excel with a specific sheet
db = Database(
    database_type="excel",
    username="",
    password="workbookPassword",
    host="path/to/excel_file",
    port=None,
    database_name="excel_file.xlsx",
    options={"dataAddress": "'my_sheet'!A1"} # Specify the data address of the selected sheet
)

# Infer Vadalog rules from the Excel file
inferred_rules = pmtx.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-excel-sheet.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

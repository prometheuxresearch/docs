# rule_inference

The `rule_inference` module provides functions to infer Vadalog rules from a database or data source schema. It generates a linear Vadalog rule for each table or file and a join rule for each table having foreign keys.

---

## Function

```python
def infer_from_schema(type, user, password, host, port, database, add_bind=False, options=None):
```

**Parameters**

- **type** (`str`):  
  The type of the database (e.g., `"csv"`, `"neo4j"`, etc.).

- **user** (`str`):  
  The username for connecting to the database or `s3aAccessKey`.

- **password** (`str`):  
  The password for connecting to the database or `s3aSecretKey`.

- **host** (`str`):  
  The host address of the database or file location (e.g., `"localhost"`, `"s3a://mybucket"`).

- **port** (`int`):  
  The port number on which the database is accessible.  
  *(Set to `None` or `0` if not required.)*

- **database** (`str`):  
  The name of the database or the filename (e.g., `"myDatabase"` or `"myFile.csv"`).

- **table** (`str`, optional):  
  The name of the table from which to infer the schema. Defaults to `None`.

- **query** (`str`, optional):  
  A custom query to use for schema inference. If provided, this query will be used instead of inferring from a table. Defaults to `None`.  

- **add_bind** (`bool`, optional):  
  Whether to add a **bind** statement in the inferred schema. Defaults to `False`.

- **options** (`dict`, optional):  
  Additional configuration options for the schema inference. Defaults to `None`.  
  For example, you can pass custom parameters (like `"region"`, `"endpoint"`, etc.) when working with S3 or other storage systems.

---

**Returns**

- **dict** or **str**:  
  Returns inferred Vadalog rule from database or datasource schema.

---

**Raises**

- **Exception**:  
  If the database or data source is unreachable, or any unexpected error occurs during schema inference.


## Examples

### **Example 1: Inferring Schema from a Neo4j Database**

This example connects to a **Neo4j** database running locally on port **7687** and infers Vadalog rules.

```python
# Infer Vadalog rules from a Neo4j database
inferred_rules = pmtx.infer_from_schema(
    "neo4j",         # Database type
    "neo4j",         # Username
    "neo4j2",        # Password
    "localhost",     # Host
    port=7687,       # Neo4j default port
    database="neo4j",# Database name
    add_bind=True    # Include bind statements to the input data source
)

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
# Infer Vadalog rules from a CSV file stored in S3
inferred_rules = pmtx.infer_from_schema(
    "csv",           # Database type (CSV file)
    "AKIA4xxxx12",   # AWS Access Key
    "JyxxxxU+",      # AWS Secret Key
    "s3a://prometheux-data",  # S3 bucket path
    None,            # No port required for S3
    "companies.csv",   # Name of the CSV file
    add_bind=True,   # Include bind statements
    options={        # Additional AWS S3 configurations
        "region": "eu-west-2", 
        "endpoint": "s3.amazonaws.com",
        "credentials.provider": "org.apache.hadoop.fs.s3a.SimpleAWSCredentialsProvider",
        "delimiter": "\t"
    }
)

# Save the inferred rules to a file
vada_file = "infer-from-csv_s3.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```


### **Example 3: Inferring Schema from a PostgreSQL Database**

This example connects to a **PostgreSQL** database running locally on port **5432** and infers Vadalog rules.

```python
# Infer Vadalog rules from a PostgreSQL database
inferred_rules = pmtx.infer_from_schema(
    "postgresql",         # Database type
    "prometheux",         # Username
    "prometheux",        # Password
    "localhost",     # Host
    port=5432,       # PostgreSQL default port
    database="prometheux",# Database name
    add_bind=True    # Include bind statements to the input data source
)

# Save the inferred rules to a file
vada_file = "infer-from-postgresql.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

### **Example 4: Inferring Schema from Databricks**

This example connects to a **Databricks** cluster and infers Vadalog rules.

```python
# Infer Vadalog rules from a Databricks cluster
inferred_rules = pmtx.infer_from_schema(
    "databricks",      # Database type
    "token",           # Username
    "dapixxxx",        # Password
    "dbc-xxxx-02fe.cloud.databricks.com",     # Host
    port=443,       # Databricks default port
    database="/sql/1.0/warehouses/3283xxxx",# Database name
    add_bind=True    # Include bind statements to the input data source
)

# Save the inferred rules to a file
vada_file = "infer-from-databricks.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```


### **Example 5: Inferring Schema from Databricks with table**

This example connects to a **Databricks** cluster and infers Vadalog rule from a specific table.

```python
# Infer Vadalog rules from a Databricks cluster
inferred_rules = pmtx.infer_from_schema(
    "databricks",      # Database type
    "token",           # Username
    "dapixxxx",        # Password
    "dbc-xxxx-02fe.cloud.databricks.com",     # Host
    port=443,       # Databricks default port
    database="/sql/1.0/warehouses/3283xxxx",# Database name
    add_bind=True,   # Include bind statements to the input data source
    table="my_catalog.my_schema.my_table" # Specify the table (or simply my_table)
)

# Save the inferred rules to a file
vada_file = "infer-from-databricks-with-table.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```
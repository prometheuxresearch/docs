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
    add_bind=True    # Include bind statements in the output
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
        "credentials.provider": "org.apache.hadoop.fs.s3a.SimpleAWSCredentialsProvider"
    }
)

# Save the inferred rules to a file
vada_file = "infer-from-csv_s3.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```
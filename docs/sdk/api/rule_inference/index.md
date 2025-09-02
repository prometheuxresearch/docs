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

--- 

## Examples

### **Example 1: Inferring Schema from a Neo4j Database**

This example connects to a **Neo4j** database running locally on port **7687** and infers Vadalog rules.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as px
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
inferred_rules = px.infer_schema(db, add_bind=True)

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
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as px
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
inferred_rules = px.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-csv_s3.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 3: Inferring Schema from a PostgreSQL Database**

This example connects to a **PostgreSQL** database running locally on port **5432** and infers Vadalog rules.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as px
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
inferred_rules = px.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-postgresql.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 4: Inferring Schema from Databricks**

This example connects to a **Databricks** cluster and infers Vadalog rules.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as px
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
inferred_rules = px.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-databricks.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 5: Inferring Schema from Databricks with table**

This example connects to a **Databricks** cluster and infers Vadalog rule from a specific table.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as px
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
inferred_rules = px.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-databricks-with-table.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

### **Example 6: Inferring Schema from Databricks with a Specific Schema**

This example connects to a **Databricks** cluster and infers Vadalog rules from a specific schema.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as px
from prometheux_chain.model.database import Database

# Infer Vadalog rules from a Databricks cluster with a specific schema
inferred_rules = px.infer_schema(
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
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as px
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
inferred_rules = px.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-excel.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 8: Inferring Schema from a Excel sheet**

This example connects to an **Excel** file and infers Vadalog rules from a specific sheet.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as px
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
inferred_rules = px.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-excel-sheet.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

### **Example 9: Inferring Schema from Snowflake**

This example connects to a **Snowflake** database and infers Vadalog rules.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as px
from prometheux_chain.model.database import Database

#"jdbc:snowflake://A778858265xxxx-IV3xxxx.snowflakecomputing.com/?user=my_username&warehouse=my_warehouse&db=my_database&schema=my_schema&password=my_password"

# Create a Database object for Snowflake
db = Database(
    database_type="snowflake",
    username="my_username",
    password="my_password",
    host="jdbc:snowflake://A77885826xxxx-IV3xxxx.snowflakecomputing.com",
    port=443,
    database_name="my_database",
    schema="my_schema",
    options={"warehouse": "my_warehouse"}
)

# Infer Vadalog rules from the Snowflake database
inferred_rules = px.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-snowflake.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 10: Inferring Schema from a Snowflake table**

This example connects to a **Snowflake** database and infers Vadalog rules from a specific table.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as px
from prometheux_chain.model.database import Database

# Create a Database object for Snowflake with a specific table
db = Database(
    database_type="snowflake",
    username="my_username",
    password="my_password",
    host="jdbc:snowflake://A77885826xxxx-IV3xxxx.snowflakecomputing.com",
    port=443,
    database_name="my_database",
    schema="my_schema",
    options={"warehouse": "my_warehouse"},
    tables=["my_table"]
)

# Infer Vadalog rules from the Snowflake database
inferred_rules = px.infer_schema(db, add_bind=True)

# Save the inferred rules to a file
vada_file = "infer-from-snowflake-table.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```
### **Example 11: Inferring Schema from BigQuery**

This example connects to a **Google BigQuery** project and infers Vadalog rules from datasets.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN
gcpAccessToken = os.environ["GCP_ACCESS_TOKEN"]

import prometheux_chain as px
from prometheux_chain.model.database import Database

# Create a Database object for BigQuery
db = Database(
    database_type="bigquery",
    username="",
    password="",
    host="",
    port=None,
    database_name="my_project_id",
    schema="datasetId",  # optional - specify dataset ID
    options={
        "authMode": "gcpAccessToken",  # auth default mode is credentialsFile, here we use gcpAccessToken
        "gcpAccessToken": gcpAccessToken,
        "parentProject": "my_parent_project_id",  # optional - parent project ID
        "billingProjectId": "my_billing_project_id",  # optional - billing project ID
        "region": "us-central1"  # optional - BigQuery region
    }
)

# Infer Vadalog rules from the BigQuery dataset
inferred_rules = px.infer_schema(db, add_bind=True, add_model=True)

# Save the inferred rules to a file
vada_file = "infer-from-bigquery.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 12: Inferring Schema from Text File**

This example connects to a **text file** and infers Vadalog rules representing concepts extracted from the text content. The result is a list of knowledge graph schemas representing concepts and relationships found in the text.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as px
from prometheux_chain.model.database import Database

# Create a Database object for text file
db = Database(
    database_type="text",
    username="",
    password="",
    host="path/to/file",
    port=None,
    database_name="harry_potter.txt"
)

# Infer Vadalog rules from the text file
inferred_rules = px.infer_schema(db, add_bind=True, add_model=False)

# Save the inferred rules to a file
vada_file = "harry_potter.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 13: Inferring Schema from Binary File**

Binary files support various formats including **PDF**, **JPG**, **PNG**, and other binary formats. This example connects to a **PDF file** and infers Vadalog rules representing concepts extracted from the document content. The result is a list of knowledge graph schemas representing concepts and relationships found in the binary file.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as px
from prometheux_chain.model.database import Database

# Create a Database object for binary file
db = Database(
    database_type="binaryfile",
    username="",
    password="",
    host="path/to/file",
    port=None,
    database_name="harry_potter.pdf"
)

# Infer Vadalog rules from the binary file
inferred_rules = px.infer_schema(db, add_bind=True, add_model=False)

# Save the inferred rules to a file
vada_file = "harry_potter.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 14: Inferring Schema from Common Known Business Documents**

Binary files of this kind include structured documents such as **ID documents**, **receipts**, **tax forms**, **mortgage documents**, and other standardized business documents. The API supports various document types including:

- **Financial Documents**: check.us, bankStatement.us, payStub.us, creditCard, invoice
- **ID Documents**: idDocument.driverLicense, idDocument.passport, idDocument.nationalIdentityCard, idDocument.residencePermit, idDocument.usSocialSecurityCard
- **Receipts**: receipt.retailMeal, receipt.creditCard, receipt.gas, receipt.parking, receipt.hotel
- **Tax Documents**: tax.us.1040.2023, tax.us.w2, tax.us.w4, tax.us.1095A, tax.us.1098, tax.us.1099 (various forms)
- **Mortgage Documents**: mortgage.us.1003 (URLA), mortgage.us.1004 (URAR), mortgage.us.closingDisclosure
- **Other Documents**: contract, healthInsuranceCard.us, marriageCertificate.us

This example connects to a **driver's license document** and infers Vadalog rules representing concepts extracted from the document content. The result is a list of knowledge graph schemas representing concepts and relationships found in the structured document.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as px
from prometheux_chain.model.database import Database

# Create a Database object for structured binary file
db = Database(
    database_type="binaryfile",
    username="",
    password="",
    host="path/to/file",
    port=None,
    database_name="driver_license.pdf",
    options={"documentType": "idDocument.driverLicense"}
)

# Infer Vadalog rules from the structured binary file
inferred_rules = px.infer_schema(db, add_bind=True, add_model=False)

# Save the inferred rules to a file
vada_file = "driver_license.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 15: Inferring Schema from Amazon DynamoDB**

This example connects to an **Amazon DynamoDB** database and infers Vadalog rules from table schemas. The schema retriever automatically discovers table structures, column types, and maintains consistent ordering with the DynamoDB reader.

**Note**: The AWS region can be specified either as an `options` property or as the `database_name` parameter.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as pmtx
from prometheux_chain.model.database import Database

# Create a Database object for DynamoDB (region as option)
db = Database(
    database_type="dynamodb",
    username="AKIA4xxxx12",  # AWS Access Key ID
    password="JyxxxxU+",     # AWS Secret Access Key
    host="",                 # Leave empty for AWS DynamoDB
    port=None,
    database_name="",        # Leave empty to discover all tables
    options={
        "region": "us-east-1",  # Region specified as option
        "endpoint": "",         # Leave empty for AWS DynamoDB
        "sessionToken": "",     # Optional: for temporary credentials
        "sampleLimit": "100"    # Optional: number of items to sample for schema inference
    }
)

# Infer Vadalog rules from the DynamoDB tables
inferred_rules = pmtx.infer_schema(db, add_bind=True, add_model=True)

# Save the inferred rules to a file
vada_file = "infer-from-dynamodb.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 16: Inferring Schema from DynamoDB with Region as Database Name**

This example shows an alternative way to specify the AWS region by using the `database_name` parameter instead of the options.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as pmtx
from prometheux_chain.model.database import Database

# Create a Database object for DynamoDB (region as database_name)
db = Database(
    database_type="dynamodb",
    username="AKIA4xxxx12",  # AWS Access Key ID
    password="JyxxxxU+",     # AWS Secret Access Key
    host="",
    port=None,
    database_name="eu-west-2",  # Region specified as database_name
    options={
        "endpoint": "",         # Leave empty for AWS DynamoDB
        "sessionToken": "",     # Optional: for temporary credentials
        "sampleLimit": "50"     # Optional: number of items to sample
    }
)

# Infer Vadalog rules from the DynamoDB tables
inferred_rules = pmtx.infer_schema(db, add_bind=True, add_model=True)

# Save the inferred rules to a file
vada_file = "infer-from-dynamodb-region.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 17: Inferring Schema from DynamoDB Local**

This example connects to a **DynamoDB Local** instance running on localhost and infers Vadalog rules from specific tables.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as pmtx
from prometheux_chain.model.database import Database

# Create a Database object for DynamoDB Local with specific tables
db = Database(
    database_type="dynamodb",
    username="test",         # Dummy credentials for DynamoDB Local
    password="test",
    host="",
    port=None,
    database_name="us-east-1",  # Region for DynamoDB Local
    tables=["users_table", "orders_table"],  # Specify tables to infer
    options={
        "endpoint": "http://localhost:8000",  # DynamoDB Local endpoint
        "sampleLimit": "50"
    }
)

# Infer Vadalog rules from specific DynamoDB tables
inferred_rules = pmtx.infer_schema(db, add_bind=True, add_model=True)

# Save the inferred rules to a file
vada_file = "infer-from-dynamodb-local.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```

---

### **Example 18: Inferring Schema from DynamoDB with Advanced Options**

This example demonstrates advanced DynamoDB configuration options including temporary credentials and custom sampling limits.

```python
import os
TOKEN="eyJhbGci••••••••••••bz2U39Yc" # API Key generated in the Prometheux Platform
os.environ["PMTX_TOKEN"] = TOKEN

import prometheux_chain as pmtx
from prometheux_chain.model.database import Database

# Create a Database object for DynamoDB with advanced options
db = Database(
    database_type="dynamodb",
    username="ASIA4xxxx12",     # Temporary Access Key ID
    password="JyxxxxU+",        # Temporary Secret Access Key
    host="",
    port=None,
    database_name="",           # Empty to discover all tables
    tables=["specific_table"],  # Optional: limit to specific tables
    options={
        "region": "ap-southeast-2",
        "endpoint": "",
        "sessionToken": "IQoJb3JpZ2luX2VjEND...",  # Required for temporary credentials
        "sampleLimit": "200"    # Increase sample size for better schema inference
    }
)

# Infer Vadalog rules from the DynamoDB tables
inferred_rules = pmtx.infer_schema(db, add_bind=True, add_model=True)

# Save the inferred rules to a file
vada_file = "infer-from-dynamodb-advanced.vada"
with open(vada_file, 'w') as file:
    file.write(inferred_rules)
```


# Connecting to Databases and External Datasources

With connectors available for databases and support for data sources, Prometheux can be used to seamlessly integrate and migrate data across various platforms. Moreover, it supports cloud and distributed file systems like **S3** and **HDFS**, providing the flexibility needed for modern data lake and data migration scenarios.


### @bind options

The bind command allows for the configuration of `reading` from and `writing` to database and datasources.
The syntax is as follows:

```
@bind("concept_name",
      "datasource_type option_1 = 'value_1', option_2 = 'value_2', …, option_n = 'value_n'",
      "database_name",
      "table_name").
```

where `datasource_type` should be one of:
- `csv` for CSV files
- `parquet` for Parquet files
- `excel` for Excel files
- `json` for JSON files
- `postgresql` for PostgreSQL databases
- `neo4j` for Neo4j databases
- `db2` for DB2 databases
- `mariadb` for MariaDB databases               
- `oracle` for Oracle databases
- `sqlite` for SQLite databases
- `mysql` for MySQL databases
- `sqlserver` for SQL Server databases
- `h2` for H2 databases
- `sybase` for Sybase databases
- `teradata` for Teradata databases
- `redshift` for Redshift databases
- `bigquery` for Google BigQuery
- `hive` for Hive
- `presto` for Presto
- `snowflake` for Snowflake
- `databricks` for Databricks
- `api` for consuming data via API

And the available configuration options are:

- `url`: URL to use for the database connection (e.g. `jdbc:postgresql://localhost:5432/prometheux`)
- `protocol`: Protocol to use for the database connection (e.g. `jdbc`, `odbc`, `jdbc-odbc`, `bolt`)
- `host`: Database host (e.g. `localhost`)
- `port`: Database port (e.g., `5432` for postgres, `7678` for neo4j)
- `database`: Database name (e.g. `prometheux`)
- `username`: Username to login with.
- `password`: Password to login with.

## Configuring credential access

Sensitive credentials such as database connection details (e.g., username, password) or AWS credentials (e.g., accessKey, secretKey) can be specified directly as options in the @bind annotations.
Example:

```prolog
@bind("concept_name",
      "datasource_type option_1 = 'value_1', option_2 = 'value_2', …, option_n = 'value_n'",
      "database_name",
      "table_name").
```
This method allows for streamlined integration within the same code, ensuring that each datasource has its necessary credentials attached during the binding process.

However, for better security and flexibility, these credentials can also be stored in external configurations:

- Credentials can be stored the `pmtx.properties` file to centralize sensitive information and allow reusability without hardcoding values within the @bind annotations.
- REST APIs for dynamic configuration management, where you can set individual credentials or update multiple settings at once through [API endpoints](../on-prem/04-rest-api.md).

## CSV Datasource

Prometheux supports CSV files as data source, both for reading and writing.

The default CSV binding (`"csv"`) is thus suitable for processing big CSV files.
It does not make a guess about the input schema. Therefore, if no schema
([@mapping](./annotations#mapping)) is provided, all fields are treated as
strings. Values `\N` are treated as `null` values and interpreted as [Labelled
Nulls](./language-primitives#labelled-nulls) while reading the CSV file.

### @bind options

The bind command allows for the configuration of reading and writing csv files.
The syntax is as follows:

``` prolog
@bind("relation",
      "csv option_1 = 'value_1', option_2 = 'value_2', …, option_n = 'value_n'",
      "filepath",
      "filename").
```

The options that are available are

- `useHeaders`: Values can be `true` or `false`, depending on whether a header
  is available/output.
- `delimiter`: Specifies the character that is used to separate single entries
- `recordSeparator`: Specifies how the record are seperated
- `quoteMode`: Defines quoting behavior. Possible values are:
  - `all`: Quotes all fields.
  - `minimal`: Quotes fields which contain special characters such as a the
    field delimiter, quote character or any of the characters in the line
    separator string.
  - `non_numeric`: Quotes all non-numeric fields.
  - `none`: Never quotes fields.
- `nullString`: Value can be any string, which replaces null values in the csv
  file.
- `selectedColumns`: Value is a list of the form `[c1;…;cn]` to select only the
  columns `c1, …,cn` from the csv file.
  - Each value in the list is either a column name (enclosed with single quotes
    'column name') which is present in the csv's header, or is an integer
    starting from 0 denoting the column index.
  - It is also possible to specify ranges; e.g. `selectedColumns=[0:4]` reads
    only the five columns `0,1,2,3,4`.
  - It is allowed to mix the values in the list, e.g. `selectedColumns=[0:3;Column_5]` would select columns `0,1,2,3` and the column with the name
    `Column_5`.
  - Note that in order to select columns by name, a header line in the csv must
    be present.
- `multiline`: Handles multi-line fields. When multiline is set to true it handles fields that span multiple lines correctly
- `query`: perform a `SELECT` query over a CSV file. If you are familiar with SQL syntax, you can leverage that to query the CSV file. The fields of the select are the one of the first line of the CSV file.
- `coalesce`: Unifies the output in one partition. The output will be a single CSV file instead of partitioned CSV files. Supported only in standalone environments. 
 

When specifying a configuaration, any subset of these options can be set at the
same time. Each value has be surrounded by single quotation marks `'value'`. An
example for a csv bind command with configuration would be the following:

```prolog
@bind("relation",
      "csv useHeaders=false, delimiter='\t', recordSeparator='\n',
      query='select Name from users'",
      "filepath",
      "filename").
```

### Examples

In the examples below we use a sample CSV file with the following content:

```prolog
a,b,c
d,e,f
```

Simply reading a csv file into a relation:

```prolog showLineNumbers
@input("myCsv").
@bind("myCsv", "csv", "/path_to_csv/folder", "csv_name.csv").
myAtom(X,Y,Z) :- myCsv(X,Y,Z).
@output("myAtom").
```

We can also map the columns:

```prolog showLineNumbers
@input("myCsv").
@bind("myCsv", "csv useHeaders=true", "/path_to_csv/folder", "csv_name.csv").
@mapping("myCsv", 0, "var1", "string").
@mapping("myCsv", 1, "var2", "string").
@mapping("myCsv", 2, "var3", "string").

myAtom(X,Y,Z) :- myCsv(X,Y,Z).
@output("myAtom").
```

**Example for `selectedColumns`**

The following reads only the the four columns with indices `0,1,2,4` from the
CSV file, excluding the column `3`.

```prolog showLineNumbers
@input("myCsv").
@bind("myCsv", "csv selectedColumns=[0:2; 4]", "/path_to_csv/folder", "csv_name.csv").

withoutThree(W, X,Y,Z) :- myCsv(W, X,Y,Z).
@output("withoutThree").
```

To store results into another CSV file, you must bind the entry
point. In this example, we read a CSV file, perform a SQL query to select Name, Surname and Age of users without mapping annotations and write
the output into another CSV file:

```prolog
% Define the input source as a CSV file named "users.csv" located in "/path_to_csv/folder"
% The file contains columns "Name", "Surname", "Age" and potentially other fields. Perform a `select` query over the CSV file and filter and only records where "Age > 10", which are loaded into the "user" relation.
@input("user").
@bind("user", "csv query='select Name,Surname,Age from user where Age > 10'", "/path_to_csv/folder", "users.csv").

% Define a new relation "user_name_surname" that selects users from the "user" relation
% with an additional condition that their "Age" is less than 5. This relation returns the
% "Name", "Surname", and "Age" of users.
user_name_surname(X,Y,Z) :- user(Name,Surname,Age), Age < 5.

% Declare that the results of "user_name_surname" will be written to an output.
@output("user_name_surname").

% Bind the "user_name_surname" relation to output partitioned CSV files in a folder named "new_users" 
% in the folder "/another_csv_path/folder/output".
@bind("user_name_surname", "csv", "/another_csv_path/folder/output", "new_users").

```

## Parquet Datasource

 Parquet is a columnar storage format optimized for both storage efficiency and query performance, making it well-suited for large-scale data lake scenarios.
 In this section, we'll explore how Parquet files can be integrated into Vadalog workflows, using the provided example:

```prolog
% Declare the input concept 'shipping_parquet' that will be used to refer to the data
@input("shipping_parquet").

% Bind the 'shipping_parquet' concept to a Parquet file located in the specified directory
% The data source type is 'parquet', and the file is 'shipping.parquet' in the 'disk/data/input_files' folder
@bind("shipping_parquet", "parquet", "disk/data/input_files", "shipping.parquet").

% Define a rule that extracts the 'OrderId' and 'ShippingDate' from the 'shipping_parquet' data
% The 'shipping_parquet_test' concept is created from the data in the 'shipping_parquet' input
shipping_parquet_test(OrderId, ShippingDate) :- shipping_parquet(OrderId, ShippingDate).

% Declare the output concept 'shipping_parquet_test', making the processed data available for output
@output("shipping_parquet_test").
```

## Excel Datasource
Excel files are widely used for tabular data storage and exchange in business and analytics workflows. Prometheux can easily read from and write to Excel files, integrating them seamlessly into its data processing workflows.

In this example, we will read data from a CSV file and populate an Excel file with the extracted data.

```prolog
% Declare the input concept 'shipping_excel_csv' to read data from a CSV file
@input("shipping_excel_csv").

% Bind the 'shipping_excel_csv' concept to the CSV file 'shipping_data_excel.csv' located in the 'disk/data/generated_data' directory
% Use 'useHeaders=true' to indicate that the first row contains column headers
@bind("shipping_excel_csv", "csv useHeaders=true", "disk/data/generated_data", "shipping_data_excel.csv").

% Model definition for the 'shipping_excel' concept, specifying the data types for OrderId (int) and ShippingDate (date)
@model("shipping_excel", "['OrderId:int','ShippingDate:date']").

% Rule to populate the 'shipping_excel' concept by extracting OrderId and ShippingDate from 'shipping_excel_csv'
shipping_excel(OrderId, ShippingDate) :- shipping_excel_csv(OrderId, ShippingDate).

% Bind the 'shipping_excel' concept to an Excel file 'shipping.xls' in the 'disk/data/input_files' directory
% Use 'useHeaders=true' to indicate that column headers should be included in the Excel file
@bind("shipping_excel", "excel useHeaders=true", "disk/data/input_files", "shipping.xls").

% Declare the output concept 'shipping_excel' for writing to the Excel file
@output("shipping_excel").
```

In this example, we will read data from the previously populated Excel file.

```prolog
% Declare the input concept 'shipping_excel' to read from the Excel file
@input("shipping_excel").

% Bind the 'shipping_excel' concept to the Excel file 'shipping.xls' located in 'disk/data/input_files'
% Use 'useHeaders=true' to indicate that the first row contains column headers
@bind("shipping_excel", "excel useHeaders=true", "disk/data/input_files", "shipping.xls").

% Define a rule that extracts OrderId and ShippingDate from 'shipping_excel'
shipping_excel_test(OrderId, ShippingDate) :- shipping_excel(OrderId, ShippingDate).

% Declare the output concept 'shipping_excel_test' for making the processed data available
@output("shipping_excel_test").

```

In this example, we will read data from a specific sheet of an Excel file.

```prolog
% Declare the input concept 'shipping_excel_sheet' to read data from a specific sheet of an Excel file
@input("shipping_excel_sheet").

% Bind the 'shipping_excel_sheet' concept to the Excel file 'shipping.xls' located in 'disk/data/input_files'
% Use 'useHeaders=true' to indicate that the first row contains column headers
@bind("shipping_excel_sheet", "excel useHeaders=true, dataAddress=''Sheet1'!A1'", "disk/data/input_files", "shipping.xls").      

% Define a rule that extracts OrderId and ShippingDate from 'shipping_excel_sheet'
shipping_excel_sheet_test(OrderId, ShippingDate) :- shipping_excel_sheet(OrderId, ShippingDate).

% Declare the output concept 'shipping_excel_sheet_test' for making the processed data available
@output("shipping_excel_sheet_test").     
```

## PostgreSQL Database
PostgreSQL is a robust open-source relational database that supports a wide range of data types and advanced querying capabilities. In this section, we will explore how to integrate PostgreSQL with Vadalog by first populating a customer table from a CSV file and then reading data from it using two approaches: full table read and a custom query.

In this example, we read data from a CSV file and populate the customer table in a PostgreSQL database.

```prolog
% Declare the input concept 'customer_postgres_csv' to read from the CSV file
@input("customer_postgres_csv").

% Bind the 'customer_postgres_csv' concept to the CSV file located in 'disk/data/generated_data/customer_postgres.csv'
% The option 'useHeaders=true' indicates the CSV file contains headers
@bind("customer_postgres_csv", "csv useHeaders=true", "disk/data/generated_data", "customer_postgres.csv").

% Define a rule that extracts CustomerID, Name, Surname, and Email from the CSV and assigns them to the 'customer_postgres' concept
customer_postgres(CustomerID, Name, Surname, Email) :- 
        customer_postgres_csv(CustomerID, Name, Surname, Email).

% Define the data model for the 'customer_postgres' concept (mapping column names to types)
@model("customer_postgres", "['customer_id:int', 'name:string', 'surname:string', 'email:string']").

% Declare the 'customer_postgres' concept as the output, which will be written to the PostgreSQL database
@output("customer_postgres").

% Bind the 'customer_postgres' concept to a PostgreSQL table 'customer' in the 'prometheux' database
% Specify the database connection details (host, port, username, and password)
@bind("customer_postgres", "postgresql host='postgres-host', port=5432, username='prometheux', password='myPassw'", 
      "prometheux", "customer").

```

This example demonstrates reading the full customer table from PostgreSQL.

```prolog
% Declare the input concept 'customer_postgres' to read data from the 'customer' table in PostgreSQL
@input("customer_postgres").

% Bind the 'customer_postgres' concept to the PostgreSQL table 'customer' in the 'prometheux' database
@bind("customer_postgres", "postgresql host='postgres-host', port=5432, username='prometheux', password='myPassw'", 
      "prometheux", "customer").

% Define a rule to extract CustomerID, Name, Surname, and Email from the 'customer' table in PostgreSQL
customer_postgres_test(CustomerID, Name, Surname, Email) :- 
        customer_postgres(CustomerID, Name, Surname, Email).

% Declare the output concept 'customer_postgres_test' to make the processed data available
@output("customer_postgres_test").

```

In this example, we read specific columns and filter data using a SQL query.

```prolog
% Declare the input concept 'customer_postgres' to read data using a custom SQL query
@input("customer_postgres").

% Bind the 'customer_postgres' concept to PostgreSQL using a SQL query
% The query filters for CustomerID > 0 and selects CustomerID and Email
@qbind("customer_postgres", "postgresql host='postgres-host', port=5432, username='prometheux', password='myPassw', database='prometheux'", 
      "", "select CustomerID, Email from customer where CustomerID > 0").

% Define a rule to filter the emails that end with 'prometheux.ai'
customer_postgres_test(CustomerID, Email) :- 
        customer_postgres(CustomerID, Email), OnlyPx = ends_with(Email, "prometheux.ai"), OnlyPx = #T.

% Declare the output concept 'customer_postgres_test' to make the filtered data available
@output("customer_postgres_test").

```

## MariaDB Database
MariaDB is a popular open-source relational database, highly compatible with MySQL. It supports various SQL features and is commonly used in web applications and data platforms. In this example, we will explore how to interact with a MariaDB database in Prometheux, focusing on reading data from the order_customer table to test if the data has been populated correctly.

```prolog
% Declare the input concept 'order_mariadb' to read data from the 'order_customer' table in MariaDB
@input("order_mariadb").

% Bind the 'order_mariadb' concept to the 'order_customer' table in MariaDB
% The connection details (host, port, username, and password) are specified
@bind("order_mariadb", "mariadb host='mariadb-host', port=3306, username='prometheux', password='myPassw'", 
      "prometheux", "order_customer").

% Define a rule that extracts OrderId, CustomerId, and Cost from the 'order_customer' table
order_mariadb_test(OrderId, CustomerId, Cost) :- 
        order_mariadb(OrderId, CustomerId, Cost).

% Declare the output concept 'order_mariadb_test', making the processed data available
@output("order_mariadb_test").

```

## Neo4j Database
Neo4j is a graph database designed for efficiently storing and querying highly connected data. In this example, we'll explore how to populate Neo4j with nodes representing Person and Order entities, as well as relationships between them. We'll also cover how to query this data using a Cypher query.

This example shows how to read data from a CSV file, populate Neo4j with Person and Order nodes, and create a relationship between them.

```prolog
% Declare the input concept 'persons_order_neo4j_csv' to read data from the CSV file
@input("persons_order_neo4j_csv").

% Bind the 'persons_order_neo4j_csv' concept to the CSV file located in 'disk/data/generated_data/persons_order_neo4j.csv'
@bind("persons_order_neo4j_csv", "csv useHeaders=true", "disk/data/generated_data", "persons_order_neo4j.csv").

% Define the 'person_neo4j' concept by extracting customer details from the CSV file
person_neo4j(CustomerId, Name, Surname, Email) :- 
        persons_order_neo4j_csv(CustomerId, Name, Surname, Email, OrderId, Cost).

% Bind the 'person_neo4j' concept to a Neo4j node with label 'Person'
@output("person_neo4j").
@bind("person_neo4j", "neo4j username='neo4j', password='myPassw', host='neo4j-host', port=7680", "neo4j", "(:Person)").

% Map the 'person_neo4j' concept's fields to the Neo4j 'Person' node properties
@model("person_neo4j", "['customerId(ID):int', 'name:string', 'surname:string', 'email:string']").

% Define the 'order' concept by extracting order details from the CSV file
order(OrderId, Cost) :- 
        persons_order_neo4j_csv(CustomerId, Name, Surname, Email, OrderId, Cost).

% Bind the 'order' concept to a Neo4j node with label 'Order'
@output("order").
@bind("order", "neo4j username='neo4j', password='myPassw', host='neo4j-host', port=7680", "neo4j", "(:Order)").

% Map the 'order' concept's fields to the Neo4j 'Order' node properties
@mapping("order", 0, "orderId(ID)", "int").
@mapping("order", 1, "cost", "string").

% Define the 'order_person_rel_neo4j' concept for creating a relationship between Order and Person
order_person_rel_neo4j(OrderId, CustomerId) :- 
        persons_order_neo4j_csv(CustomerId, Name, Surname, Email, OrderId, Cost).

% Bind the 'order_person_rel_neo4j' concept to create a relationship between the 'Order' and 'Person' nodes in Neo4j
@output("order_person_rel_neo4j").
@bind("order_person_rel_neo4j", "neo4j username='neo4j', password='myPassw', host='neo4j-host', port=7680", "neo4j", "(:Order)-[IS_RELATED_TO]->(:Person)").

% Map the 'order_person_rel_neo4j' concept's fields to the relationship between Order and Person
@mapping("order_person_rel_neo4j", 0, "orderId:orderId(sID)", "int").
@mapping("order_person_rel_neo4j", 1, "customerId:customerId(tID)", "int").
```

In this example, we query Neo4j to retrieve the relationship between Person and Order nodes.

```prolog
% Declare the input concept 'persons_order_neo4j' for querying Neo4j
@input("persons_order_neo4j").

% Use @qbind to execute a Cypher query that retrieves OrderId and CustomerId from related Order and Person nodes
@qbind("persons_order_neo4j", "neo4j username='neo4j', password='myPassw', host='neo4j-host', port=7680", "", 
       "MATCH (o:Order)-[r:IS_RELATED_TO]->(p:Person) RETURN o.orderId, p.customerId").

% Define a rule to store the result of the Cypher query into the 'persons_order_neo4j_test' concept
persons_order_neo4j_test(CustomerId, OrderId) :- 
        persons_order_neo4j(CustomerId, OrderId).

% Declare the output concept 'persons_order_neo4j_test' to make the query result available
@output("persons_order_neo4j_test").
```

## S3 Storage
Amazon S3 (Simple Storage Service) is a widely used cloud storage service that allows for scalable object storage. In Vadalog, you can both read from and write to S3 buckets by treating the S3 storage as a file system. This example demonstrates how to interact with S3, specifically by writing a CSV file to S3 and then reading from it.

In this example, we first read data from a CSV file stored locally and then write it to an S3 bucket.

```prolog
% Declare the input concept 'user_csv' to read from the CSV file located on the local disk
@input("user_csv").

% Bind the 'user_csv' concept to the local CSV file 'users.csv' located in 'disk/datasources'
@bind("user_csv", "csv useHeaders=true", "disk/datasources", "users.csv").

% Define a rule to map the data from 'user_csv' to the 'user' concept
user(X) :- user_csv(X).

% Declare the output concept 'user' for writing the data to an S3 bucket
@output("user").

% Bind the 'user' concept to a CSV file in the specified S3 bucket
@bind("user", "csv", "s3a://your-s3-bucket/", "user.csv").
```

In this example, we demonstrate how to read data from a CSV file stored in an S3 bucket.

```prolog
% Declare the input concept 'user_s3' to read data from the CSV file in the S3 bucket
@input("user_s3").

% Bind the 'user_s3' concept to the CSV file 'user.csv' located in the specified S3 bucket
@bind("user_s3", "csv", "s3a://your-s3-bucket/", "user.csv").

% Define a rule to map the data from 'user_s3' to the 'user' concept
user(X) :- user_s3(X).

% Declare the output concept 'user' for making the data available after reading from S3
@output("user").
```

## Example: S3 Storage Integration

You can use a similar approach to bind predicates to CSV files stored in Amazon S3:

```prolog
% Declare the input concept 'user_s3' to read data from the CSV file in the S3 bucket
@input("user_s3").

% Bind the 'user_s3' concept to the CSV file 'user.csv' located in the specified S3 bucket
@bind("user_s3", "csv", "s3a://your-s3-bucket/", "user.csv").

% Map the data as needed
user(X) :- user_s3(X).

% Declare the output concept
@output("user").
```
---

## Consuming Data via API

This example shows how to connect to an external API endpoint that returns data in JSON, XML, CSV format

Below is a full example for ingesting weather data from the Meteomatics API in CSV format.

```prolog
% Bind the predicate to the API endpoint
@bind(
    "meteo",
    "api delimiter=';', username='my_username', password='my_password', responseFormat='csv'",
    "https://api.meteomatics.com/",
    "2025-06-09T00:00:00Z--2025-06-12T00:00:00Z:PT3H/t_2m:C,relative_humidity_2m:p/47.423336,9.377225/csv"
).

% Declare an output predicate
@output("meteo_out").

% Map the data to the output predicate
meteo_out(Valid_Date, T_2m_C, Relative_humidity_2m_p) :- meteo(Valid_Date, T_2m_C, Relative_humidity_2m_p).
```

## Customization

* **API format**: The pattern above supports any API providing CSV data. For JSON/XML APIs, adjust the format parameter and data mapping accordingly (e.g. use `json` or `xml` in the `@bind`).
* **Authentication**: Many APIs support token-based auth (use `token='your_token'` instead of username/password).
* **Delimiter**: Update the `delimiter` parameter to match your API's CSV format if not using semicolons.

---

## HDFS File system
HDFS (Hadoop Distributed File System) is designed for distributed storage and large-scale data processing. Vadalog can integrate with HDFS by reading from and writing to files stored in HDFS clusters. This example shows how to read a CSV file from an HDFS location and process it within a Prometheux workflow.

```prolog
% Declare the input concept 'user_csv' to read from the CSV file located in HDFS
@input("user_csv").

% Bind the 'user_csv' concept to the CSV file located in HDFS ('users.csv')
% The file is located in the HDFS directory: hdfs://hdfs-host:9000/user
% The 'useHeaders=true' option indicates that the first row contains column headers
@bind("user_csv", "csv useHeaders=true", "hdfs://hdfs-host:9000/user", "users.csv").

% Define a rule to map the data from 'user_csv' to the 'user' concept
user(X) :- user_csv(X).

% Declare the output concept 'user' for making the processed data available
@output("user").
```

## Sybase Database
Sybase (now SAP ASE) is a relational database management system used for online transaction processing. This example shows how to read data from a Sybase database.

```prolog
% Declare the input concept 'order_sybase' to read data from the 'orders' table in Sybase
@input("order_sybase").

% Bind the 'order_sybase' concept to the Sybase database using the JDBC connection details
@bind("order_sybase", "sybase host='sybase-host', port=5000, username='myUser', password='myPassw'", 
      "myDatabase", "orders").

% Define a rule that extracts OrderId, CustomerId, and Amount from the 'orders' table in Sybase
order_sybase_test(OrderId, CustomerId, Amount) :- 
        order_sybase(OrderId, CustomerId, Amount).

% Declare the output concept 'order_sybase_test' to make the processed data available
@output("order_sybase_test").
```

## Teradata Database
Teradata is a highly scalable relational database often used in enterprise data warehousing. This example shows how to read data from a Teradata database.
```prolog
% Declare the input concept 'sales_teradata' to read data from the 'sales' table in Teradata
@input("sales_teradata").

% Bind the 'sales_teradata' concept to the Teradata database using the JDBC connection details
@bind("sales_teradata", "teradata host='teradata-host', port=1025, username='myUser', password='myPassw'", 
      "myDatabase", "sales").

% Define a rule to extract SaleId, ProductId, and SaleAmount from the 'sales' table in Teradata
sales_teradata_test(SaleId, ProductId, SaleAmount) :- 
        sales_teradata(SaleId, ProductId, SaleAmount).

% Declare the output concept 'sales_teradata_test' for making the processed data available
@output("sales_teradata_test").

```

## Amazon Redshift
Amazon Redshift is a fully managed data warehouse service designed for large-scale data analytics. This example shows how to read data from a Redshift table.

```prolog
% Declare the input concept 'analytics_redshift' to read data from the 'analytics' table in Redshift
@input("analytics_redshift").

% Bind the 'analytics_redshift' concept to the Redshift database using the JDBC connection details
@bind("analytics_redshift", "redshift host='redshift-cluster.amazonaws.com', port=5439, username='myUser', password='myPassword'", 
      "analyticsDB", "analytics").

% Define a rule to extract data from the 'analytics' table in Redshift
analytics_redshift_test(AnalysisId, Metric, Value) :- 
        analytics_redshift(AnalysisId, Metric, Value).

% Declare the output concept 'analytics_redshift_test' for making the processed data available
@output("analytics_redshift_test").
```

## Google BigQuery
Google BigQuery is a serverless, highly scalable, and cost-effective multi-cloud data warehouse. This example demonstrates configuring and querying data from a BigQuery dataset.

#### Setting up Google Cloud Access

This guide shows how to:

1. Enable the required Google Cloud APIs  
2. Create a service account for Prometheux jobs  
3. Grant the minimum IAM roles (data access & Storage API)  
4. Allow a human user to **impersonate** the service account and obtain short‑lived access tokens  
5. Create a JSON key file  
6. Generate a one‑hour access token  

> **Project ID example:** `project-example-358816`  
> **Service account name example:** `example-sa`  
> **Human user example:** `example@gmail.com`

---
Open a Google Cloud Shell within your Google Project and execute the following commands:
#### 1  Enable required APIs

```bash
gcloud services enable   compute.googleapis.com   bigquery.googleapis.com   bigquerystorage.googleapis.com   iamcredentials.googleapis.com   --project=project-example-358816
```

---

#### 2  Create the service account

```bash
PROJECT_ID=project-example-358816
SA_NAME=example-sa

gcloud iam service-accounts create "$SA_NAME"   --project="$PROJECT_ID"   --display-name="Spark BigQuery SA"
```

Resulting e‑mail:  
`example-sa@project-example-358816.iam.gserviceaccount.com`

---

#### 3  Grant **minimum BigQuery roles** to the service account

```bash
gcloud projects add-iam-policy-binding "$PROJECT_ID"   --member="serviceAccount:$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"   --role="roles/bigquery.dataViewer"

gcloud projects add-iam-policy-binding "$PROJECT_ID"   --member="serviceAccount:$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"   --role="roles/bigquery.jobUser"

gcloud projects add-iam-policy-binding "$PROJECT_ID"   --member="serviceAccount:$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"   --role="roles/bigquery.readSessionUser"
```

---

#### 4  Allow your user to **impersonate** the service account

```bash
gcloud iam service-accounts add-iam-policy-binding   "$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"   --member="user:example@gmail.com"   --role="roles/iam.serviceAccountTokenCreator"
```

Verify:

```bash
gcloud iam service-accounts get-iam-policy   "$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"   --filter="bindings.role:roles/iam.serviceAccountTokenCreator"
```

---

#### 5 Create a JSON key file

If you prefer file‑based creds:

```bash
gcloud iam service-accounts keys create ~/gcp-credentials.json   --iam-account="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
```

Read the content
```bash
cat ~/gcp-credentials.json
```

Copy and paste it into a new file in your laptop or environment in your `/path/to/gcp-credentials.json`

This authMode is the default one.

Set the ENV var (in Docker or via `EXPORT`)
`GOOGLE_APPLICATION_CREDENTIALS=/path/to/gcp-credentials.json`, **or** set the `bigquery.credentialsFile=/path/to/gcp-credentials.json` in the `pmtx.properties` configuration file **or** declare the path via `credentialsFile=/path/to/gcp-credentials.json` as an option in the bind annotation.

---

#### 6  Generate a one‑hour access token (impersonation)

If you prefer token‑based creds:

```bash
gcloud auth print-access-token   --impersonate-service-account="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
```
Enable token-based authMode by setting set the `bigquery.authMode` in the `pmtx.properties`configuration file **or** declare it as an option in the bind annotation `authMode=gcpAccessToken` and set the ENV var (in Docker or via `EXPORT`)
`GCP_ACCESS_TOKEN=my-token`, **or** set the `bigquery.gcpAccessToken=my-token` config property **or** pass it via `gcpAccessToken=my-token` as option in the bind annotation.

### Example using credentials file

```prolog
% Bind the BigQuery table with credentials file
@bind("table",
      "bigquery credentialsFile=/path/to/gcp-credentials.json",
      "project-example-358816",
      "bigquery-public-data.thelook_ecommerce.order_items").

% Rule to project the first three columns from the BigQuery table
bigquery_table(X,Y,Z) :- table(X,Y,Z).

% Post-process the BigQuery table to limit the results to 10
@post("bigquery_table","limit(10)").

% Define the output for the BigQuery table
@output("bigquery_table").
```

### Example using token

```prolog
% Bind the BigQuery table with token
@bind("table",
      "bigquery authMode=gcpAccessToken, token=/path/to/gcp-credentials.json",
      "project-example-358816",
      "bigquery-public-data.thelook_ecommerce.order_items").

% Rule to project the first three columns from the BigQuery table
bigquery_table(X,Y,Z) :- table(X,Y,Z).

% Define the output for the BigQuery table
@output("bigquery_table").
% Post-process the BigQuery table to limit the results to 10
@post("bigquery_table","limit(10)").
```

### Example via query

```prolog
% Bind a BigQuery query to retrieve product revenue data
@qbind("query",
       "bigquery credentialsFile=src/test/resources/bigquery-credentials.json",
       "quantum-feat-358816",
       "SELECT product_id, SUM(sale_price) AS revenue FROM `bigquery-public-data.thelook_ecommerce.order_items` 
        WHERE sale_price > 100 GROUP BY product_id ORDER BY revenue DESC LIMIT 10").

% Define a rule to map the query results to the bigquery_query predicate
bigquery_query(X,Y) :- query(X,Y).

% Declare the output for the bigquery_query predicate
@output("bigquery_query").
```

## Snowflake
Snowflake is a cloud-based data warehousing service that allows for data storage, processing, and analytics. 

### How to Retrieve Your Snowflake Connection Info for reading or writing tables

To obtain the connection details for your Snowflake account:

1. Click the **user icon** in the **bottom-left corner** of the Snowflake UI.
2. Select **"Connect a tool to Snowflake"**.
3. Go to the **"Connectors / Drivers"** section.
4. Choose **"JDBC"** as the connection method.
5. Select your **warehouse**, **database**, and set **"Password"** as the authentication method.

This will generate a JDBC connection string in the following format:

```
jdbc:snowflake://A778xxx-IVxxxx.snowflakecomputing.com/?user=PROMETHEUX&warehouse=COMPUTE_WH&db=TEST&schema=PUBLIC&password=my_password
```

From this string, you can extract the following values for your bind configuration:

- `url = 'A778xxx-IVxxxx.snowflakecomputing.com'`
- `username = 'PROMETHEUX'`
- `password = 'my_password'`
- `warehouse = 'COMPUTE_WH'`
- `database = 'TEST'` (note: database names are usually uppercase)


This example demonstrates reading data from a Snowflake table.

```prolog
% Declare the input concept 'transactions_snowflake' to read data from the 'transactions' table in Snowflake
@input("transactions_snowflake").

% Bind the 'transactions_snowflake' concept to the Snowflake database using the JDBC connection details
@bind("transactions_snowflake", "snowflake url='A778xxx-IVxxxx.snowflakecomputing.com', username='PROMETHEUX', password='myPassword', warehouse='COMPUTE_WH'", 
      "TEST", "transaction_data").

% Define a rule to extract TransactionId, CustomerId, and Amount from the 'transactions' table in Snowflake
transactions_snowflake_test(TransactionId, CustomerId, Amount) :- 
        transactions_snowflake(TransactionId, CustomerId, Amount).

% Declare the output concept 'transactions_snowflake_test' for making the processed data available
@output("transactions_snowflake_test").
```

## Databricks
Databricks is a cloud-based platform for data engineering and data science.

This example demonstrates writing data to a Databricks table.

```prolog
% Declare the input concept 'sales_postgres' to read data from the 'sales' table in Postgres
@input("sales_postgres").

% Bind the 'sales_postgres' concept to the Postgres database using the JDBC connection details
@qbind("sales_postgres","postgresql host='postgres-host', port=5432, username='prometheux', password='myPassw'",
      "postgres", "select sale_id, product_id, sale_amount from sales").

% Define a rule to extract SaleId, ProductId, and SaleAmount from the 'sales' table in Postgres
sales_databricks(SaleId, ProductId, SaleAmount) :- 
        sales_postgres(SaleId, ProductId, SaleAmount).

% Declare the output concept 'sales_databricks' to write data to the Databricks table   
@output("sales_databricks").
@model("sales_databricks", "['sale_id:int', 'productId:int', 'sale_amount:int']").

% Bind the 'sales_databricks' concept to the Databricks cluster using the JDBC connection details
@bind("sales_databricks","databricks batchSize=5, password='dapixxxx', host='dbc-xxxx-02fe.cloud.databricks.com'",
      "/sql/1.0/warehouses/3283xxxx", "sales").
```

This example demonstrates reading data from a Databricks table.

```prolog
% Declare the input concept 'sales_databricks' to read data from the 'sales' table in Databricks
@input("sales_databricks").

% Bind the 'sales_databricks' concept to the Databricks cluster using the JDBC connection details
@qbind("sales_databricks","databricks fetchSize=5, password='dapixxxx', host='dbc-xxxx-02fe.cloud.databricks.com'",
      "/sql/1.0/warehouses/3283xxxx", "select sale_id, productId from sales").

% Define a rule to extract ProductId from the 'sales' table in Databricks
sales(Product) :- 
        sales_databricks(Sale, Product).

% Declare the output concept 'sales' to return the processed data
@output("sales").
```
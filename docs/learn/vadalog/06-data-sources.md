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
- `csv`
- `parquet`
- `excel`
- `json`
- `postgresql`
- `neo4j`
- `db2`
- `mariadb`
- `oracle`
- `sqlite`
- `mysql`
- `sqlserver`
- `h2`
- `sybase`
- `teradata`
- `redshift`
- `bigquery`
- `snowflake`
- `hive`
- `presto`

And the available configuration options are

- `host`: Database host (e.g. localhost)
- `port`: Database port (e.g., `5432` for postgres, `7678` for neo4j)
- `username`: Username to login with.
- `password`: Password to login with.

## Configuring credential access

Sensitive credentials such as database connection details (e.g., username, password) or AWS credentials (e.g., accessKey, secretKey) can be specified directly as options in the @bind annotations. This method allows for streamlined integration within the same code, ensuring that each datasource has its necessary credentials attached during the binding process.

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
@bind("person_neo4j", "neo4j username='neo4j', password='myPassw', host='neo4j-host', port=7680", ":Person", "node").

% Map the 'person_neo4j' concept's fields to the Neo4j 'Person' node properties
@mapping("person_neo4j", 0, "customerId(ID)", "int").
@mapping("person_neo4j", 1, "name", "string").
@mapping("person_neo4j", 2, "surname", "string").
@mapping("person_neo4j", 3, "email", "string").

% Define the 'order' concept by extracting order details from the CSV file
order(OrderId, Cost) :- 
        persons_order_neo4j_csv(CustomerId, Name, Surname, Email, OrderId, Cost).

% Bind the 'order' concept to a Neo4j node with label 'Order'
@output("order").
@bind("order", "neo4j username='neo4j', password='myPassw', host='neo4j-host', port=7680", ":Order", "node").

% Map the 'order' concept's fields to the Neo4j 'Order' node properties
@mapping("order", 0, "orderId(ID)", "int").
@mapping("order", 1, "cost", "string").

% Define the 'order_person_rel_neo4j' concept for creating a relationship between Order and Person
order_person_rel_neo4j(OrderId, CustomerId) :- 
        persons_order_neo4j_csv(CustomerId, Name, Surname, Email, OrderId, Cost).

% Bind the 'order_person_rel_neo4j' concept to create a relationship between the 'Order' and 'Person' nodes in Neo4j
@output("order_person_rel_neo4j").
@bind("order_person_rel_neo4j", "neo4j username='neo4j', password='myPassw', host='neo4j-host', port=7680", "(:Order)-[IS_RELATED_TO]->(:Person)", "relationship").

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
Google BigQuery is a serverless, highly scalable, and cost-effective multi-cloud data warehouse. This example demonstrates querying data from a BigQuery dataset.

```prolog
% Declare the input concept 'events_bigquery' to read data from the 'events' table in BigQuery
@input("events_bigquery").

% Bind the 'events_bigquery' concept to BigQuery using the JDBC connection details
@bind("events_bigquery", "bigquery projectId='myProjectId', dataset='myDataset', accessKey='myAccessKey', secretKey='mySecretKey'", 
      "events", "event_data").

% Define a rule to extract EventId, EventType, and EventTimestamp from the 'events' table in BigQuery
events_bigquery_test(EventId, EventType, EventTimestamp) :- 
        events_bigquery(EventId, EventType, EventTimestamp).

% Declare the output concept 'events_bigquery_test' for making the processed data available
@output("events_bigquery_test").
```

## Snowflake
Snowflake is a cloud-based data warehousing service that allows for data storage, processing, and analytics. This example demonstrates reading data from a Snowflake table.

```prolog
% Declare the input concept 'transactions_snowflake' to read data from the 'transactions' table in Snowflake
@input("transactions_snowflake").

% Bind the 'transactions_snowflake' concept to the Snowflake database using the JDBC connection details
@bind("transactions_snowflake", "snowflake account='myAccount', username='myUser', password='myPassword', warehouse='myWarehouse', database='myDatabase'", 
      "transactions", "transaction_data").

% Define a rule to extract TransactionId, CustomerId, and Amount from the 'transactions' table in Snowflake
transactions_snowflake_test(TransactionId, CustomerId, Amount) :- 
        transactions_snowflake(TransactionId, CustomerId, Amount).

% Declare the output concept 'transactions_snowflake_test' for making the processed data available
@output("transactions_snowflake_test").
```

# Prometheux × Databricks Deployment & Implementation Guide

---

## 1. Overview

Prometheux integrates with Databricks through JDBC connectivity across all major cloud platforms — AWS, Azure, and Google Cloud — allowing you to execute Vadalog rules against Unity Catalog tables and SQL warehouses. This integration provides secure, governed access to your lakehouse data while maintaining performance and scalability regardless of your cloud provider.

This guide covers the architecture of the integration, all configuration options, data operation patterns, security and governance considerations, and troubleshooting guidance.

**Additional information:** https://docs.prometheux.ai/learn/on-prem/databricks-integration

---

## 2. Architecture & Connectivity

### 2.1 How Prometheux Connects to Databricks

Prometheux connects to Databricks using the open-source Databricks JDBC driver with OAuth 2.0 Machine-to-Machine (M2M) authentication. This approach provides secure, token-managed connectivity without manual token handling across all supported cloud platforms.

The JDBC driver is declared as a Maven dependency:

```xml


  com.databricks
  databricks-jdbc
  1.0.10-oss

```

### 2.2 Multi-Cloud Platform Support

Prometheux supports Databricks deployments on all major cloud platforms. The connection configuration remains consistent across all platforms, with only the hostname format varying by cloud provider:

| Cloud Platform        | Workspace Hostname Format                      |
|-----------------------|------------------------------------------------|
| AWS                   | `dbc-xxxxxxxx-xxxx.cloud.databricks.com`       |
| Microsoft Azure       | `adb-xxxxxxxx-xx.x.azuredatabricks.net`        |
| Google Cloud Platform | `xxxxxxxx-xxxx.x.gcp.databricks.com`           |

### 2.3 Execution Modes

**External JDBC (Standard):** Prometheux connects to Databricks SQL Warehouses via JDBC for executing Vadalog rules against Unity Catalog tables. Best for production deployments with governed data access.

**In-Cluster Execution:** Prometheux can also run directly within Databricks notebooks by loading the Prometheux JAR on the cluster. This enables direct access to Spark tables without JDBC overhead, using the `inCluster=true` annotation.

---

## 3. JDBC Configuration

### 3.1 Authentication Option 1: OAuth 2.0 M2M (Recommended)

Configure OAuth authentication using client credentials provided by your Databricks administrator. OAuth M2M is the recommended approach for production environments as it avoids manual token management:

```properties
# Databricks JDBC OAuth Configuration
databricks.host=
databricks.httpPath=/sql/1.0/warehouses/
databricks.oauth2.clientId=
databricks.oauth2.clientSecret=

# Connection string automatically constructed:
# jdbc:databricks://:443;;AuthMech=11;Auth_Flow=1;
# OAuth2ClientId=;OAuth2Secret=
```

### 3.2 Authentication Option 2: Personal Access Token (PAT)

For development environments, personal access tokens can be used as a simpler alternative:

```properties
# Databricks JDBC Token Configuration
databricks.host=
databricks.httpPath=/sql/1.0/warehouses/
databricks.token=
databricks.authMode=PAT
```

### 3.3 UI-Based Configuration

Prometheux provides a user-friendly configuration interface for setting up Databricks connectivity. The data source connection dialog supports both OAuth and PAT authentication methods. The following fields must be completed:

| Field                   | Description                                                                                   |
|-------------------------|-----------------------------------------------------------------------------------------------|
| Database Type           | Select "Databricks" from the dropdown                                                         |
| Client ID               | For OAuth: enter your OAuth client ID. For PAT: leave empty                                   |
| Secret / PAT            | OAuth client secret or Personal Access Token (automatically masked)                           |
| Host                    | Your Databricks workspace hostname (cloud-specific format — see Section 2.2)                  |
| Port                    | `443` (default for HTTPS connections)                                                         |
| Warehouse               | SQL warehouse HTTP path, e.g. `/sql/1.0/warehouses/f66xxxxxxxxxxxxx`                         |
| Additional Options (JSON) | Optional JDBC parameters (see below)                                                        |

### 3.4 Additional Options JSON

**OAuth (default):**

```json
{
  "region": "us-east-1",
  "ConnTimeout": "10000",
  "SocketTimeout": "10000"
}
```

**Personal Access Token:**

```json
{
  "authMode": "PAT",
  "region": "us-east-1",
  "ConnTimeout": "10000",
  "SocketTimeout": "10000"
}
```

**Cloud-specific region values:**

- AWS: `"region": "us-east-1"`
- Azure: `"region": "eastus"`
- GCP: `"region": "us-central1"`

---

## 4. Data Operations

### 4.1 Reading from Unity Catalog

Configure input tables using the Unity Catalog three-level namespace (`catalog.schema.table`). The `@bind` annotation registers a table as a Prometheux input concept:

```prolog
% Input configuration for Unity Catalog tables
@bind("customers", "databricks", "sales_catalog.crm_schema", "customers").
@bind("orders", "databricks", "sales_catalog.transactions_schema", "orders").

% Vadalog rule using Unity Catalog data
customer_orders(CustomerName, OrderId, OrderDate, Amount) :-
  customers(CustomerId, CustomerName, Email),
  orders(OrderId, CustomerId, OrderDate, Amount).

@output("customer_orders").
@bind("customer_orders", "databricks", "analytics_catalog.reports_schema", "customer_orders").
```

### 4.2 In-Cluster Execution in Databricks Notebooks

Prometheux can be executed directly within Databricks notebooks using Scala. This example computes all shortest paths between airports using flight route data:

```scala
%scala
val tableName = "air_routes_edges"
val outputTable = "all_shortest_paths_routes"
val program = s"""
  @bind("air_routes","databricks inCluster=true","","Prometheux_workspace.default.$tableName").
  edge(From, To, Dist) :-
    air_routes(Id, From, To, Label, Dist).
  all_shortest_paths_routes(From, To, Distance) :- #ASP(edge).
  @output("all_shortest_paths_routes").
  @bind("all_shortest_paths_routes","databricks inCluster=true","","$outputTable").
"""
val args = Array(program)
uk.co.Prometheux.Prometheuxreasoner.PrometheuxReasonerMain.main(args)
```

Key features of in-cluster execution:

- **`inCluster=true`** — Enables direct access to Spark tables without JDBC overhead
- **Dynamic table names** — Use Scala string interpolation for flexible table references
- **Unity Catalog support** — Access tables using three-level namespace (`catalog.schema.table`)
- **Immediate results** — Output tables are created directly in the cluster

### 4.3 Multi-Step Analysis Pattern

For complex pipelines, chain multiple Vadalog programs in sequence:

```scala
%scala
// Step 1: Data preprocessing
val preprocessProgram = s"""
  @bind("raw_routes","databricks inCluster=true","","raw_flight_data").
  clean_routes(From, To, Distance) :-
    raw_routes(_, From, To, _, Distance), Distance > 0.
  @output("clean_routes").
  @bind("clean_routes","databricks inCluster=true","","clean_air_routes").
"""

// Step 2: Graph analysis
val analysisProgram = s"""
  @bind("routes","databricks inCluster=true","","clean_air_routes").
  edge(From, To, Dist) :- routes(From, To, Dist).
  shortest_path(From, To, MinDist) :- #ASP(edge).
  @output("shortest_path").
  @bind("shortest_path","databricks inCluster=true","","flight_shortest_paths").
"""

// Execute both steps
uk.co.Prometheux.Prometheuxreasoner.PrometheuxReasonerMain.main(Array(preprocessProgram))
uk.co.Prometheux.Prometheuxreasoner.PrometheuxReasonerMain.main(Array(analysisProgram))
```

### 4.4 Visualising Results in Databricks

```sql
%sql
-- Visualize results directly in Databricks
SELECT From, To, Distance
FROM all_shortest_paths_routes
WHERE Distance < 1000
ORDER BY Distance
LIMIT 100
```

---

## 5. Security & Governance

### 5.1 Unity Catalog Integration

Prometheux fully respects Unity Catalog governance policies:

- **Access Control** — User permissions are enforced through JDBC connections
- **Data Lineage** — Query execution is tracked in Unity Catalog
- **Audit Logging** — All data access is logged for compliance
- **Schema Evolution** — Automatic handling of table schema changes

### 5.2 Credential Management

**Production Deployment**

- Store client secrets in external vault systems (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault)
- Reference secrets through environment variables or vault integrations
- Rotate credentials regularly through automated processes

**Development Environment**

- Use personal access tokens with limited scopes
- Configure token expiration policies
- Enable IP allowlisting for additional security

**Security Features Built into Prometheux UI**

- **Credential Masking** — Secrets and PATs are automatically redacted in the UI
- **Dual Authentication** — Supports both OAuth M2M and PAT authentication methods
- **Vault Integration** — Supports pulling credentials from external secret managers
- **Connection Testing** — Built-in connectivity validation before saving configuration

### 5.3 Performance Best Practices

- **Use SQL Warehouses** — Leverage serverless SQL warehouses for optimal performance
- **Partition Awareness** — Prometheux respects table partitioning for efficient queries
- **Result Caching** — Automatic caching of intermediate query results
- **Batch Processing** — Optimal batch sizes for JDBC operations

---

## 6. Troubleshooting

| Issue                          | Likely Cause                                   | Resolution                                                                                                  |
|-------------------------------|------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| Authentication failure (401)  | Invalid client ID/secret or expired token      | Verify client ID and secret; check OAuth scope permissions; ensure workspace access is granted              |
| Network connectivity error    | Incorrect hostname or blocked firewall port    | Validate hostname and HTTP path; check firewall rules and IP allowlists; test JDBC connection independently |
| Permission denied on table    | Missing Unity Catalog permissions              | Verify Unity Catalog table permissions; check schema and catalog access rights; review service principal assignments |
| JDBC driver not found         | Driver JAR not on classpath                    | Confirm `databricks-jdbc 1.0.10-oss` is declared as a dependency and available on the cluster              |
| `inCluster=true` not working  | Prometheux JAR not installed on cluster        | Upload Prometheux JAR to cluster libraries and restart cluster                                              |

---

## 7. Prometheux Contacts

| Name              | Email                                    | Role                      |
|-------------------|------------------------------------------|---------------------------|
| Eleni Partakki    | eleni@prometheux.co.uk                   | Forward Deployed Engineer |
| Teodoro Baldazzi  | teodoro.baldazzi@prometheux.co.uk        | Principal Engineer        |

# Prometheux on Databricks

Prometheux integrates seamlessly with Databricks to leverage its powerful lakehouse platform for large-scale data processing and analytics. This integration allows you to execute Vadalog rules directly on Databricks compute while maintaining all data within the Databricks environment.

## Spark Submit Integration

The Spark Submit integration model packages Prometheux as a JAR file and submits it as a Databricks job. This approach is ideal for production-scale deployments where you need reliable, scheduled execution of Vadalog workflows.

### Packaging and Deployment

To deploy Prometheux using Spark Submit:

1. **Package your Vadalog rules** and dependencies into a JAR file
2. **Upload the JAR** to Databricks File System (DBFS) or Unity Catalog Volumes
3. **Submit the job** using the Databricks Jobs API

### Sample Jobs API Payload

Here's an example JSON payload for submitting a Prometheux job via the Databricks Jobs API:

```json
{
  "run_name": "prometheux-vadalog-analysis",
  "tasks": [
    {
      "task_key": "vadalog_processing",
      "spark_jar_task": {
        "main_class_name": "ai.prometheux.engine.VadalogSparkRunner",
        "jar_uri": "dbfs:/jars/prometheux-engine-1.0.jar",
        "parameters": [
          "--vadalog-file", "/Volumes/catalog/schema/volume/rules/analysis.vada",
          "--output-table", "catalog.schema.results",
          "--mode", "production"
        ]
      },
      "new_cluster": {
        "spark_version": "13.3.x-scala2.12",
        "node_type_id": "i3.xlarge",
        "num_workers": 4,
        "spark_conf": {
          "spark.sql.adaptive.enabled": "true",
          "spark.sql.adaptive.coalescePartitions.enabled": "true"
        }
      },
      "libraries": [
        {
          "jar": "dbfs:/jars/prometheux-dependencies.jar"
        }
      ]
    }
  ]
}
```

### Delta Lake and Unity Catalog Integration

Results are automatically written back to **Delta Lake tables** governed by **Unity Catalog**:

- **Schema Evolution**: Prometheux automatically handles schema changes in Delta tables
- **ACID Transactions**: All writes benefit from Delta Lake's transactional guarantees  
- **Governance**: Unity Catalog provides lineage tracking, access control, and data discovery
- **Optimization**: Delta Lake's optimization features (Z-ordering, liquid clustering) improve query performance

```sql
-- Results are written to governed Delta tables
SELECT * FROM catalog.schema.analysis_results 
WHERE processing_date >= '2024-01-01'
```

### Production Benefits

- **Scalability**: Leverages Databricks auto-scaling for large datasets
- **Reliability**: Built-in retry mechanisms and error handling
- **Monitoring**: Integration with Databricks job monitoring and alerting
- **Cost Optimization**: Automatic cluster termination after job completion

## Spark Connect Integration

Spark Connect integration allows Prometheux to connect remotely to a Databricks all-purpose cluster, enabling interactive development and real-time rule execution.

### Configuration

Configure Prometheux to connect via Spark Connect by setting up your `spark-defaults.conf`:

```properties
# Spark Connect Configuration
spark.sql.catalog.spark_catalog=com.databricks.sql.cloud.DatabricksSparkSessionCatalog
spark.sql.catalog.spark_catalog.url=sc://adb-<workspace-id>.<region>.databricks.com
spark.sql.catalog.spark_catalog.token=<databricks-token>
spark.sql.catalog.spark_catalog.clusterId=<cluster-id>

# Prometheux-specific properties
prometheux.databricks.workspace.url=sc://adb-<workspace-id>.<region>.databricks.com
prometheux.databricks.token=<databricks-token>
prometheux.databricks.cluster.id=<cluster-id>
prometheux.execution.mode=spark-connect
```

### Example: Join Rule Execution

Here's how Prometheux compiles a Vadalog join rule into Spark DataFrame operations:

**Vadalog Rule:**
```prolog
% Input tables from Unity Catalog
@input("customers").
@bind("customers", "databricks", "catalog.sales", "customers").

@input("orders").  
@bind("orders", "databricks", "catalog.sales", "orders").

% Join rule: Find customer orders with their details
customer_orders(CustomerName, OrderId, OrderDate, Amount) :- 
    customers(CustomerId, CustomerName, Email),
    orders(OrderId, CustomerId, OrderDate, Amount).

% Output to Unity Catalog
@output("customer_orders").
@bind("customer_orders", "databricks", "catalog.analytics", "customer_orders").
```

**Generated Spark Operations:**
```python
# Prometheux automatically generates equivalent Spark DataFrame operations
customers_df = spark.table("catalog.sales.customers")
orders_df = spark.table("catalog.sales.orders")

# Compiled join operation
result_df = customers_df.alias("c") \
    .join(orders_df.alias("o"), col("c.CustomerId") == col("o.CustomerId")) \
    .select(
        col("c.CustomerName"),
        col("o.OrderId"), 
        col("o.OrderDate"),
        col("o.Amount")
    )

# Write back to Unity Catalog
result_df.write \
    .mode("overwrite") \
    .option("mergeSchema", "true") \
    .saveAsTable("catalog.analytics.customer_orders")
```

### Development Benefits

- **Interactive Development**: Real-time feedback during rule development
- **Jupyter Integration**: Use Prometheux directly in Databricks notebooks
- **Live Data Access**: Query live Unity Catalog tables without data movement
- **Rapid Prototyping**: Test rules immediately against production-scale data

## General Notes

### Lakehouse-Native Processing

- **No Data Movement**: All processing happens within the Databricks Lakehouse
- **Unity Catalog Integration**: Full governance, lineage, and access control
- **Delta Lake Optimization**: Leverages Delta's performance optimizations
- **Compute Efficiency**: Uses Databricks' optimized Spark runtime

### Data Processing Philosophy

Prometheux follows a **compute-to-data** approach:

- **Data Remains in Place**: No duplication or unnecessary data movement
- **Leverages Databricks Compute**: Uses Databricks' optimized Spark clusters
- **Native Integration**: Works with existing Databricks workflows and tools
- **Governance Preservation**: Maintains all Unity Catalog governance policies

### AI Services Integration

Prometheux can optionally integrate with Databricks AI services for data enrichment:

```prolog
% Example: Using Databricks LLMs for data enrichment
@input("customer_feedback").
@bind("customer_feedback", "databricks", "catalog.raw", "feedback").

% Generate sentiment analysis using Databricks AI
enriched_feedback(FeedbackId, Text, Sentiment) :-
    customer_feedback(FeedbackId, Text),
    Sentiment = llm:generate(
        "Analyze the sentiment of this feedback: ${arg_1}. Return only: positive, negative, or neutral",
        "string",
        Text
    ).

@output("enriched_feedback").
@bind("enriched_feedback", "databricks", "catalog.analytics", "sentiment_analysis").
```

### Choosing the Right Integration Model

| Use Case | Recommended Model | Benefits |
|----------|-------------------|----------|
| Production ETL/ELT | Spark Submit | Reliability, scaling, scheduling |
| Interactive Development | Spark Connect | Real-time feedback, notebooks |
| Scheduled Analytics | Spark Submit | Cost optimization, monitoring |
| Data Exploration | Spark Connect | Flexibility, rapid iteration |
| ML Pipeline Integration | Spark Submit | Automation, MLOps integration |

Both integration models ensure that your Vadalog rules execute efficiently on Databricks while maintaining full integration with the platform's governance, security, and optimization features. 
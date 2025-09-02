# Prometheux Snowflake Native App

Prometheux is available as a **Snowflake Native App** that runs entirely within your Snowflake environment. This deployment model provides seamless integration with Snowflake's ecosystem while maintaining complete data sovereignty and security.

---

## Overview

The Snowflake Native App enables you to:
- **Create unified virtual knowledge graphs** connecting fragmented data sources
- **Perform advanced reasoning** without data migration
- **Leverage Snowflake's compute** for high-performance data processing
- **Maintain data sovereignty** - all processing happens within your Snowflake account

### Key Advantages

- ✅ **No data migration required** - data stays in original sources
- ✅ **Snowflake-native security** - leverages Snowflake's access controls
- ✅ **Elastic compute** - scales with Snowflake warehouses and compute pools
- ✅ **Marketplace distribution** - easy installation and updates

---

## Installation

### Prerequisites

- **Snowflake warehouse** (Medium or larger recommended for inference tasks)
- **Compute pool** for app execution
- **ACCOUNTADMIN role** (for initial setup and compute pool management)

### Installation Methods

#### **Option 1: Snowflake Marketplace**
1. Navigate to **Snowflake Marketplace**
2. Search for **"Prometheux"**
3. Click **Install** and follow the guided setup
4. Click **Activate** then **Launch** in Snowsight

#### **Option 2: Private Listing**
Contact Prometheux team for private listing access and installation instructions.

---

## Configuration

### Basic Setup with Default Compute Pool

```sql
-- The app will use default compute pool settings
-- Simply launch after installation from Snowsight UI
```

### Custom Compute Pool Setup

```sql
-- Set up role context (ACCOUNTADMIN required for compute pools)
USE ROLE ACCOUNTADMIN;

-- Create a custom compute pool
CREATE COMPUTE POOL custom_compute_pool_prometheux
    MIN_NODES = 1
    MAX_NODES = 1
    INSTANCE_FAMILY = CPU_X64_M        -- See performance options below
    AUTO_RESUME = TRUE;

-- Grant usage privileges
GRANT USAGE ON COMPUTE POOL custom_compute_pool_prometheux TO APPLICATION prometheux;
GRANT BIND SERVICE ENDPOINT ON ACCOUNT TO APPLICATION prometheux;

-- Set up database and schema context for app control
USE DATABASE prometheux;
USE SCHEMA v1;

-- Start the application
CALL start_platform('custom_compute_pool_prometheux');

-- Get the application URL
CALL platform_url();
```

### Performance and Cost Options

| Instance Family | vCPU | Memory | Use Case | Cost Impact |
|----------------|------|---------|----------|-------------|
| `CPU_X64_M` | 6 | 28 GiB | Default, balanced | Baseline |
| `CPU_X64_L` | 28 | 116 GiB | Performance-focused | ~4x |
| `HIGHMEM_X64_S` | 6 | 58 GiB | ML/AI workloads | ~2x |

**💡 Tip**: Monitor usage with `SHOW COMPUTE POOLS` to optimize cost vs. performance.

---

## Data Upload

### Via Snowsight UI
1. Navigate to **Data → Databases → PROMETHEUX_APP → APP_PUBLIC → STAGES → USER_UPLOADS**
2. Use the **upload button** to add your files
3. Files are automatically transferred to internal storage

### Via SQL Commands
```sql
-- Set up database and schema context for file upload
USE DATABASE prometheux;
USE SCHEMA app_public;

-- Upload your file to the user uploads stage
PUT file://path/to/your.csv @user_uploads AUTO_COMPRESS=FALSE;
```

**⚠️ Important**: Snowflake Native Apps don't support filenames with spaces. Use underscores or hyphens:
- ✅ **Good**: `my_data_file.csv`, `customer-data.csv`
- ❌ **Bad**: `my data file.csv`

---

## External Access Configuration

The app automatically configures **SNOWFLAKE_OUTBOUND** for core functionality. Additional integrations enable enhanced features.

### Required Privileges

**For Non-ACCOUNTADMIN Users**, your administrator must grant:

```sql
-- Administrator grants required privileges (run as ACCOUNTADMIN)
USE ROLE ACCOUNTADMIN;

-- Grant app usage privileges
GRANT USAGE ON APPLICATION prometheux TO ROLE your_role_name;
GRANT USAGE ON SCHEMA prometheux.v1 TO ROLE your_role_name;
GRANT USAGE ON ALL PROCEDURES IN SCHEMA prometheux.v1 TO ROLE your_role_name;

-- Grant compute pool privileges
GRANT USAGE ON COMPUTE POOL platform_compute_pool TO ROLE your_role_name;
```

### Optional External Integrations

#### **Prometheux API Integration**
Enables connectivity to Prometheux cloud services:

```sql
USE ROLE ACCOUNTADMIN;
CREATE DATABASE IF NOT EXISTS prometheux_app_data;
CREATE SCHEMA IF NOT EXISTS prometheux_app_data.security;
USE DATABASE prometheux_app_data;
USE SCHEMA security;

-- Create Network Rule
CREATE OR REPLACE NETWORK RULE prometheux_network_rule
  MODE = EGRESS
  TYPE = HOST_PORT
  VALUE_LIST = ('*.prometheux.ai', 'databases.prometheux.ai:0');

-- Create External Access Integration
CREATE OR REPLACE EXTERNAL ACCESS INTEGRATION prometheux_outbound
  ALLOWED_NETWORK_RULES = (prometheux_network_rule)
  ENABLED = true;

-- Grant to Application
GRANT USAGE ON INTEGRATION prometheux_outbound TO APPLICATION prometheux;
```

#### **Azure OpenAI Integration**
Enables AI/ML capabilities:

```sql
USE ROLE ACCOUNTADMIN;
USE DATABASE prometheux_app_data;
USE SCHEMA security;

-- Create Network Rule for Azure OpenAI
CREATE OR REPLACE NETWORK RULE azure_openai_network_rule
  MODE = EGRESS
  TYPE = HOST_PORT
  VALUE_LIST = (
    '*.azure.com',
    '*.openai.com',
    '*.cognitiveservices.azure.com'
  );

-- Create External Access Integration
CREATE OR REPLACE EXTERNAL ACCESS INTEGRATION azure_openai_outbound
  ALLOWED_NETWORK_RULES = (azure_openai_network_rule)
  ENABLED = true;

-- Grant to Application
GRANT USAGE ON INTEGRATION azure_openai_outbound TO APPLICATION prometheux;
```

### Using Multiple Integrations

```sql
-- Set up database and schema context for app control
USE DATABASE prometheux;
USE SCHEMA v1;

-- Start with multiple integrations
CALL start_platform_with_multiple_integrations(
  'platform_compute_pool', 
  'prometheux_outbound, azure_openai_outbound'
);

-- Verify integration usage
DESCRIBE SERVICE app_public.platform;
```

---

## App Management

### Application Lifecycle

```sql
-- Set up database and schema context
USE DATABASE prometheux;
USE SCHEMA v1;

-- Start the application
CALL start_platform('compute_pool_name');

-- Get application URL
CALL platform_url();

-- Restart the application
CALL restart_platform();

-- Stop the application
CALL stop_platform();
```

### Monitoring and Maintenance

```sql
-- Check compute pool status
SHOW COMPUTE POOLS;

-- View app service status
DESCRIBE SERVICE app_public.platform;

-- Monitor external access integrations
SHOW GRANTS ON APPLICATION prometheux;
```

---

## Data Processing Architecture

### Native App Benefits

- **Secure Execution**: All processing happens within your Snowflake account
- **No Data Movement**: Data remains in Snowflake's secure environment
- **Elastic Scaling**: Leverages Snowflake's compute elasticity
- **Unified Access**: Single interface for all your Snowflake data

### Supported Data Sources

While running as a Native App, Prometheux can still connect to:
- **Snowflake tables** (native access)
- **External databases** (via external access integrations)
- **Cloud storage** (S3, Azure Blob, GCP)
- **APIs and services** (with appropriate network rules)

---

## Security and Compliance

### Data Sovereignty
- **Data never leaves** your Snowflake environment
- **Compute isolation** through Snowflake's containerized execution
- **Access controls** managed through Snowflake's RBAC system

### Network Security
- **Controlled external access** through explicit network rules
- **Minimal connectivity** - only required services enabled
- **Audit trail** through Snowflake's query history and access logs

---

## Troubleshooting

### Common Issues

**App won't start:**
- Verify compute pool exists and has proper grants
- Check ACCOUNTADMIN privileges for compute pool operations

**External connections fail:**
- Verify external access integrations are created and granted
- Check network rules include required endpoints

**Performance issues:**
- Consider upgrading compute pool instance family
- Monitor with `SHOW COMPUTE POOLS` for resource utilization

### Cleanup

```sql
-- Stop platform before cleanup
USE DATABASE prometheux; USE SCHEMA v1; CALL stop_platform();

-- Drop compute pool (requires ACCOUNTADMIN)
USE ROLE ACCOUNTADMIN;
DROP COMPUTE POOL custom_compute_pool_prometheux;

-- Clean up external access integrations
USE DATABASE prometheux_app_data; USE SCHEMA security;
DROP EXTERNAL ACCESS INTEGRATION IF EXISTS prometheux_outbound;
DROP NETWORK RULE IF EXISTS prometheux_network_rule;
```

---

## Comparison with Other Deployment Models

| Feature | Native App | Databricks Integration | On-Premise |
|---------|------------|----------------------|------------|
| **Data Sovereignty** | ✅ Within Snowflake | ✅ Within Databricks | ✅ Your infrastructure |
| **Setup Complexity** | 🟡 Moderate | 🟡 Moderate | 🔴 Complex |
| **Scaling** | ✅ Snowflake elastic | ✅ Databricks auto-scale | 🟡 Manual |
| **Marketplace Install** | ✅ Yes | ❌ No | ❌ No |
| **External Connectivity** | 🟡 Via integrations | ✅ Native | ✅ Direct |

The Snowflake Native App provides the optimal balance of ease-of-use, security, and integration for Snowflake-centric data environments. 
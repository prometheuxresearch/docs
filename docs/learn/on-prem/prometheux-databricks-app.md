# Prometheux Databricks App

AI-powered Knowledge Graph platform deployed as a Databricks native application.

## Features

- **React Frontend**: Modern UI for data exploration and visualization
- **FastAPI Backend**: High-performance Python API
- **Java Services**: Data Manager and Vadalog Parser
- **Single-port Architecture**: Unified deployment via Node.js proxy

## Prerequisites

- Databricks workspace (AWS, Azure, or GCP)
- Databricks CLI installed and configured (`databricks configure`)
- AWS credentials for Java services - contact Prometheux to obtain

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/prometheuxresearch/prometheux-databricks-app.git
cd prometheux-databricks-app
```

### 2. Configure Environment Variables

Copy the example configuration:

```bash
cp bundle-vars.example.yml bundle-vars.yml
```

Edit `bundle-vars.yml` and fill in the AWS credentials provided by Prometheux:

```yaml
# Data Manager (provided by Prometheux)
data_manager_s3_bucket: "<provided-by-prometheux>"
data_manager_s3_key: "<provided-by-prometheux>"
data_manager_aws_access_key_id: "<provided-by-prometheux>"
data_manager_aws_secret_access_key: "<provided-by-prometheux>"

# Vadalog Parser (provided by Prometheux)
vadalog_parser_s3_bucket: "<provided-by-prometheux>"
vadalog_parser_s3_key: "<provided-by-prometheux>"
vadalog_parser_aws_access_key_id: "<provided-by-prometheux>"
vadalog_parser_aws_secret_access_key: "<provided-by-prometheux>"
```

:::info
Contact Prometheux to obtain these credentials (required for full functionality).
:::

### 3. Deploy & Run

```bash
./deploy.sh
```

The script will:
- Check if you have Databricks CLI installed
- Prompt you to set up Lakebase (recommended) or use SQLite
- Deploy the app to your Databricks workspace
- Ask if you want to start the app immediately

If you decline to run the app, you can start it later with:

```bash
./deploy.sh run
```

### 4. Access Your App

Your app will be available at:

```
https://prometheux-<workspace-id>.databricksapps.com
```

Other useful commands:

```bash
./deploy.sh run      # Start the app (if not started during deploy)
./deploy.sh restart  # Restart app (fast - processes auto-cleanup)
./deploy.sh stop     # Stop compute (slow - takes minutes to restart)
./deploy.sh status   # Check app status
./deploy.sh logs     # View app logs
./deploy.sh destroy  # Remove the app
```

## Java Services & Prometheux Engine

### Data Manager & Vadalog Parser

The app includes Java services that are downloaded automatically at runtime:

- **Data Manager**: Advanced data processing and integration
- **Vadalog Parser**: Parses and validates Vadalog logic programs

**Setup**: Contact Prometheux to obtain AWS credentials, then add them to `bundle-vars.yml` (see Step 2 above).

### Prometheux Engine

The Prometheux Engine is the full reasoning engine for executing Vadalog programs.

:::important
The Prometheux Engine is NOT included in this app package.

✅ Provided separately by Prometheux as a Databricks cluster library  
✅ Installed directly on your Databricks cluster  
✅ Contact Prometheux to request access and installation guidance
:::

## Configuration

### Database Storage

The app uses Lakebase (Databricks managed PostgreSQL) for persistent data storage.

The `./deploy.sh` script automatically handles Lakebase setup:
- Creates Lakebase project
- Configures permissions
- Connects the app

**Alternative**: If you decline Lakebase, the app uses SQLite (ephemeral - data lost on restart).

### Configuration Variables

All configuration is in `bundle-vars.yml`. See the Quick Start (Step 2) for required values.

Core settings:
- `run_mode`: `development` (default, no auth) or `production`
- `organization`: Your organization name
- `username`: Default username (development mode only)
- Java services: AWS credentials provided by Prometheux (see Quick Start Step 2)

## Architecture

### Application Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      PROMETHEUX DATABRICKS APP                          │
│                    (Databricks Apps Container)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  User Browser                                                           │
│       │                                                                 │
│       ├──────────> Node.js Proxy (Port 8000)                           │
│                           │                                             │
│                           ├── /api/*   ──> FastAPI Backend              │
│                           │                    │                        │
│                           │                    ├─> Data Manager         │
│                           │                    │   (Java service)       │
│                           │                    │                        │
│                           │                    ├─> Vadalog Parser       │
│                           │                    │   (Java service)       │
│                           │                    │                        │
│                           │                    └─> Lakebase             │
│                           │                        (PostgreSQL)         │
│                           │                                             │
│                           └── /*       ──> React Frontend               │
│                                           (Static files)                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Authentication:
                                    │ • Bearer Token (from frontend)
                                    │ • OAuth2 M2M
                                    │ • User-to-Machine (U2M)
                                    │ • Personal Access Token (PAT)
                                    │ • Or default Databricks App credentials
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                   DATABRICKS WORKSPACE ENVIRONMENT                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              DATABRICKS COMPUTE (Spark Clusters)               │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐    │  │
│  │  │         Prometheux Engine (PX JAR)                     │    │  │
│  │  │  • Installed via Libraries API                         │    │  │
│  │  │  • Graph Analytics                                     │    │  │
│  │  │  • ETL Processing                                      │    │  │
│  │  │  • Data Processing                                     │    │  │
│  │  └────────────────────────────────────────────────────────┘    │  │
│  │                          ▲                                     │  │
│  │                          │ Jobs Submit API                     │  │
│  │                          │ (Vadalog execution)                 │  │
│  └──────────────────────────┼─────────────────────────────────────┘  │
│                             │                                        │
│                             │ Spark Connect API                      │
│                             │ (Get Results)                          │
│                             │                                        │
│  ┌──────────────────────────┴─────────────────────────────────────┐  │
│  │                    UNITY CATALOG                               │  │
│  │  • Volumes (Uploaded JARs)                                     │  │
│  │  • Tables (Input/Output)                                       │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Authentication Flow:**
1. Frontend passes auth token to Backend
2. Backend authenticates with Databricks using:
   - User's Bearer Token (U2M)
   - OAuth2 M2M credentials
   - Personal Access Token (PAT)
   - Or default App credentials
3. Backend submits Vadalog jobs to Prometheux Engine on cluster
4. Results retrieved via Spark Connect API

### Key Components

**Databricks App Container:**
- **React Frontend**: Modern UI for ontology management and data exploration
- **FastAPI Backend**: Python API handling business logic
- **Node.js Proxy**: Single entry point, routes requests to frontend/backend
- **Data Manager**: Advanced data processing (Java service)
- **Vadalog Parser**: Logic program validation (Java service)
- **Lakebase**: Persistent PostgreSQL storage for user data

**Databricks Workspace:**
- **Prometheux Engine**: Full reasoning engine (separate installation on cluster)
- **Unity Catalog**: Data and library storage
- **Spark Clusters**: Compute resources for engine execution

## Updating

To update to a new version:

```bash
cd prometheux-databricks-app
git pull
databricks bundle deploy --var-file bundle-vars.yml
databricks bundle run prometheux
```

Your `bundle-vars.yml` configuration will be preserved.

## Troubleshooting

### Check App Logs

```bash
databricks apps logs prometheux
```

### Check App Status

```bash
databricks apps get prometheux
```

### Common Issues

- **App won't start**: Check that all S3 credentials are correct and buckets are accessible
- **404 errors**: Ensure the app has finished starting (can take 2-3 minutes)
- **Java services not running**: Check that JAR files exist in S3 at the specified paths

## Development Mode

The default `run_mode: development` bypasses JWT authentication for easier testing. For production, set `run_mode: production` in your `bundle-vars.yml`.
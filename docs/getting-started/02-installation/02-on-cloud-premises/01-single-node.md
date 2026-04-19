# Single Node

> Deploy Prometheux on a single VM (AWS EC2, Azure VM, GCP Compute Engine, or
> bare metal) using Docker Compose.

## Overview

The Docker deploy method lets you run Prometheux on infrastructure you control.
It packages the core reasoning engine and a JupyterLab environment into
containers managed by Docker Compose, making it suitable for cloud VMs and
on-premises servers alike.

## Prerequisites

- **Docker** and **Docker Compose** installed on the target machine
- **PROMETHEUX_PULL_IMAGE_TOKEN** — a token required to pull Docker images from
  the Prometheux container registry (contact the Prometheux team to obtain one)
- Minimum recommended hardware: 4 vCPUs, 16 GB RAM, 50 GB disk

## Quick Start

### 1. Clone the Repository

```bash
git clone git@github.com:prometheuxresearch/prometheux-deploy.git
cd prometheux-deploy
```

### 2. Configure the Image Pull Token

Obtain the **PROMETHEUX_PULL_IMAGE_TOKEN** from the Prometheux team and replace
the content of the `prometheux-image-pull-token.txt` file with the provided
token.

### 3. Start the Services

```bash
./docker-compose-up.sh
```

This script reads the image pull token and starts all services in detached
mode.

### 4. Access the Services

Once started, the following services are available:

| Service | Port | Description |
| --- | --- | --- |
| **vadalog-parallel** | `8080` | The [core reasoning engine](/learn/getting-started) of Prometheux |
| **JupyterLab** | `8888` | Notebook environment with Python and Vadalog kernels |

To install the Python SDK inside JupyterLab:

```bash
pip install --upgrade prometheux_chain
```

## Configuration

You can modify the configuration files for vadalog-parallel. These are mounted
from the host in the `prometheux/vadalog-parallel/` folder.

For a full list of engine configuration properties, see the
[Configuration Reference](/getting-started/installation/on-cloud-premises/cluster#configuration-reference).

:::tip
Ensure that the paths specified in `docker-compose.yml` match your directory
structure. Modify the `.sh` scripts as needed to fit your environment.
:::

## Cloud-Specific Tips

<details>
<summary><strong>AWS EC2</strong></summary>

- **Recommended instance**: `m5.xlarge` (4 vCPU, 16 GB) or larger
- **Security group**: Allow inbound TCP on ports `8080` and `8888` from your IP
  range
- Install Docker on Amazon Linux 2:
  ```bash
  sudo yum update -y
  sudo yum install -y docker
  sudo service docker start
  sudo usermod -aG docker ec2-user
  ```
- Install Docker Compose following the
  [official instructions](https://docs.docker.com/compose/install/linux/)

</details>

<details>
<summary><strong>Azure VM</strong></summary>

- **Recommended size**: `Standard_D4s_v3` (4 vCPU, 16 GB) or larger
- **Network Security Group (NSG)**: Add inbound rules for ports `8080` and
  `8888`
- Install Docker on Ubuntu:
  ```bash
  sudo apt-get update
  sudo apt-get install -y docker.io docker-compose-v2
  sudo usermod -aG docker $USER
  ```

</details>

<details>
<summary><strong>GCP Compute Engine</strong></summary>

- **Recommended machine type**: `e2-standard-4` (4 vCPU, 16 GB) or larger
- **Firewall rules**: Allow TCP on ports `8080` and `8888` with an appropriate
  source range
- Install Docker on Debian/Ubuntu:
  ```bash
  sudo apt-get update
  sudo apt-get install -y docker.io docker-compose-v2
  sudo usermod -aG docker $USER
  ```

</details>

## Management

**Stop all services:**

```bash
./docker-compose-down.sh
```

**View logs:**

```bash
docker compose logs -f
```

**Update to a new version:**

Pull the latest images with a valid token and restart:

```bash
./docker-compose-down.sh
./docker-compose-up.sh
```

## Next Steps

- [REST API](/api/rest-api) — Interact with the engine programmatically
- [Python SDK](/api) — Use `prometheux_chain` from notebooks or scripts
- [Configuration Reference](/getting-started/installation/on-cloud-premises/cluster#configuration-reference) — Tune engine
  properties

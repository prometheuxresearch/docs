---
slug: /sdk
---

# Overview

Prometheux_chain is a Python SDK designed to power your knowledge graphs by:

- ingesting a constellation of datasources from a variety of databases and files,
- reasoning over it and augmenting it with the new derived knowledge
- providing the explanations of the results.

### Requirements

- Python 3.7 or higher
- Ensure that the Constellation and Jarvis services are active

### Optional

- An LLM of your choosing. Currently we support `OpenAI`'s chat models.

## Installation

### With pip

```bash
  pip install git+https://github.com/prometheuxresearch/prometheux_chain.git
```

### From source

1. Clone the [repository](https://github.com/prometheuxresearch/prometheux_chain).
2. Create a virtual environment and install dependencies:

```bash
  python3 -m venv myvenv
  source venv/bin/activate
  pip3 install -r requirements.txt
```

### Into Jupyter

To manually install the library in your Jupyter Lab or Jupyter Notebook follows these steps

```bash
  python3 -m venv myenv
  source venv/bin/activate
  pip install -e .
  rm -r myenv/lib/python3.x/site-packages/prometheux_chain/
  cp -r ../prometheux_chain myenv/lib/python3.x/site-packages
  jupyter lab
```

# config

The `config` module provides an interface for reading and writing configuration values from a YAML file. It includes functions to load, retrieve, and update configuration values.

## Functions
---

```python
def get(key, default=None)
```

Retrieves a value from the configuration using the specified key.

**Parameters:**

- `key` _(str)_: The key for the configuration value to retrieve.
- `default` _(optional)_: A default value to return if the key is not found.

**Returns:**
The value associated with the specified key, or None if the key does not exist.

**Example:**
```python
token = pmtx.config.get("PMTX_TOKEN")
print(token)
```

---


```python
def set(key, value)
```

Sets a configuration value for the specified key and saves the updated configuration to the file.

**Parameters:**

- `key` _(str)_: The key for the configuration value to set.
- `value`: The value to associate with the key.

**Example:**
```python
pmtx.config.set("PMTX_TOKEN", "new_token")
```

---

```python
def update_config(updates)
```

Update multiple configuration values at once from a dictionary.

**Parameters:**

- `updates` _(dict)_: A dictionary containing keys and values to update.

**Example:**

```python
pmtx.config.update_config({
    "PMTX_TOKEN": "updated_token",
    "LLM_API_KEY": "new_api_key"
})
```

**Configuring** `PMTX_TOKEN`

The `PMTX_TOKEN` can be configured in two ways:

**1. Using Environment Variables**

You can set the token as an environment variable:

```python
import os

os.environ['PMTX_TOKEN'] = 'pmtx_token'
```


**2. Using the SDK Configuration**

You can use the SDK's configuration interface to set the token:

```python
import prometheux_chain as pmtx

pmtx.config.set("PMTX_TOKEN", "pmtx_token")
```



## Configuring LLMs

The Prometheux Chain exploits LLMs to generate more human-readable `explanations`, `translations` of Vadalog rules, `graph rag` and LLM output `validation` tasks. By default, no LLM is configured.

### Setting up the LLM

To enable and configure an LLM, such as OpenAI's GPT, follow these steps:

1. **Set the LLM Provider:**
   Configure the desired LLM by specifying the provider. In this example, we'll use OpenAI.

   ```python
   prometheux_chain.config.set("LLM_PROVIDER", "OpenAI")
   ```

2. **Provide the API Key:**
   Set your OpenAI API key to allow Prometheux Chain to interact with the OpenAI service.

   ```python
   prometheux_chain.config.set("LLM_API_KEY", "your_api_key")
   ```

### Default Configurations


The SDK uses the following default configurations:

```plaintext
# PMTX
PMTX_TOKEN: None

# =====================
# Large Language Models
# =====================
LLM_API_KEY: None
LLM_PROVIDER: OpenAI
LLM_VERSION: gpt-4o
LLM_TEMPERATURE: 0.50
LLM_MAX_TOKENS: 2000
EMBEDDING_MODEL_VERSION: text-embedding-3-large
EMBEDDING_DIMENSIONS: 2048
```
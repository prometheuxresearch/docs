# config

---

**Module**: `prometheux_chain.config`

The `config` module provides a simple interface for reading and writing configuration values from a YAML file. It includes a `Config` class that can be used to load, retrieve, and update configuration values, as well as a singleton instance of this class (`config`) that can be imported and used throughout the chain.

## Functions

---

```python
def get(key)
```

Retrieves a value from the configuration using the specified key.
**Parameters:**

- `key` (str): The key for the configuration value to retrieve.
  **Returns:**
  The value associated with the specified key, or None if the key does not exist.

```python
def set(key, value)
```

Sets a configuration value for the specified key and saves the updated configuration to the file.
**Parameters:**

- `key` (str): The key for the configuration value to set.
- `value`: The value to associate with the key.

## Configuring LLMs

The Prometheux Chain exploits LLMs to generate more human-readable explanations and translations of Vadalog rules. By default, no LLM is configured.

### Setting up OpenAI as the LLM

To enable and configure an LLM, such as OpenAI's GPT, follow these steps:

1. **Set the LLM Provider:**
   Configure the desired LLM by specifying the provider. In this example, we'll use OpenAI.

   ```python
   prometheux_chain.config.set("LLM", "OpenAI")
   ```

2. **Provide the API Key:**
   Set your OpenAI API key to allow Prometheux Chain to interact with the OpenAI service.

   ```python
   prometheux_chain.config.set("OPENAI_API_KEY", "your_openai_api_key")
   ```

   This setup will enable the Prometheux Chain to use OpenAI's language model for generating explanations and translations.

### Disabling the LLM

If you prefer to use basic, non-LLM explanations, you can disable the LLM:

```python
prometheux_chain.config.set("LLM", "None")
```

This command will revert to standard explanations without LLM assistance.

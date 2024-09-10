# Quickstart

The following sections describe the steps to use the SDK, from connecting to databases to obtaining explanations of reasoning results.

## Connecting to Databases

Load database configurations from a YAML file. This step initializes the connection settings without migrating any data:

```python
import prometheux_chain as pmtx

databases = pmtx.connect_from_yaml("databases.yaml")
```

```yml title="databases.yaml"
databases:
  - alias: "ownerships dataset"
    database: "ownerships.csv"
    database_type: "csv"
    username: "***"
    password: "***"
    host: "/my_folder"
    port: "8080"
  - alias: "sample postgresql"
    database_type: "postgres"
    database: "database"
    username: "user"
    password: "password"
    host: "database.myhost.com"
    port: "5432"
```

## Configuring your LLM (Optional)

Using an LLM allows you to get more human-readable explanations and translations
of Vadalog rules. This step is optional if you don't have an LLM.

```python
prometheux_chain.config.set("LLM", "OpenAI")
prometheux_chain.config.set("OPENAI_API_KEY", "your_openai_api_key")
```

For more options, consult the [config](./api/config#configuring-llms)

## Compiling Ontology from Vadalog

Compile ontologies from [Vadalog](../learn/vadalog/) files and display its rules:

```python
ontology = pmtx.compile_vadalog("file.vada")
ontology.show_rules()
```

## Binding Inputs

Identify and display compatible bindings between data sources and input predicates:

```python
potential_input_bindings = pmtx.bind_input(ontology, databases)
potential_input_bindings.show()
```

## Selecting Input Bindings

Select specific input bindings from the list of compatible ones:

```python
selected_input_bindings = pmtx.select_bindings(potential_input_bindings, {0})
```

## Binding Outputs

Identify and display compatible bindings between data sources and output predicates:

```python
potential_output_bindings = pmtx.bind_output(ontology)
potential_output_bindings.show()
```

## Selecting Output Bindings

Select specific output bindings from the list of compatible ones:

```python
selected_output_bindings = pmtx.select_bindings(potential_output_bindings, {2})
```

## Reasoning

Execute a reasoning task using the selected ontology and bindings, with an option to enable explainability:

```python
reasoning_task = pmtx.reason(ontology, selected_input_bindings, selected_output_bindings, for_explanation = True)
```

## Displaying Paginated Reasoning Results

Retrieve and display paginated results from the reasoning task, specifying page number and size:

```python
paginated_results = reasoning_task.get(new_page = 0, new_page_size = 100)
paginated_results.show()
```

## Generating Textual Explanations

Generate and display the textual explanation for a selected result, optionally enhanced by a JSON glossary file
containing natural language descriptions of the predicates:

```python
pmtx.explain(paginated_results.get(0), json_glossary="glossary.json")
```

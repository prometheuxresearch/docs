# Graph RAG

The `graph_rag` function performs GraphRAG (Graph Retrieval-Augmented Generation) operations, combining graph reasoning with retrieval-augmented generation to answer questions using both structured data and language models.

---

## Function

```python
def graph_rag(workspace_id="workspace_id", project_id, question, graph_selected_concepts=None, graph_available_concepts=None, rag_concepts=None, rag_records=None, project_scope="user", llm=None, top_k=5)
```

**Parameters**
- `workspace_id` _(str, optional)_:
  The workspace identifier. Defaults to "workspace_id".

- `project_id` _(str)_:
  The project identifier. Required for GraphRAG operations.

- `question` _(str)_:
  The question to answer. Required for GraphRAG operations.

- `graph_selected_concepts` _(list, optional)_:
  List of concept names to directly execute for graph operations. If provided, this takes priority over `graph_available_concepts`.

- `graph_available_concepts` _(list, optional)_:
  List of concept names available to the LLM orchestrator for automatic concept selection. If neither this nor `graph_selected_concepts` is provided, the orchestrator will choose among all concepts in the project.

- `rag_concepts` _(list, optional)_:
  List of dictionaries with concept and field information for RAG operations.
  Format: `[{"concept": "concept_name", "field_to_embed": "field_name"}]`

- `rag_records` _(list, optional)_:
  List of retrieved records for RAG operations.

- `project_scope` _(str, optional)_:
  The scope of the project. Defaults to "user".

- `llm` _(dict, optional)_:
  LLM configuration dictionary.

- `top_k` _(int, optional)_:
  Number of top results to retrieve. Defaults to 5.

**Returns**
- The GraphRAG response data.

**Raises**
- Exception: If an error occurs during GraphRAG operations or if question is not provided.

---

## GraphRAG Modes

GraphRAG supports different modes for both embeddings and graph concepts:

### Embedding Modes

1. **Internal Embeddings**: The system performs embedding-based retrieval internally by specifying which concept and field to embed using `rag_concepts`.

2. **External Embeddings**: You provide the results of embedding-based retrieval directly using `rag_records`.

### Graph Concept Modes

1. **Explicit Graph Concepts**: You explicitly specify which graph concepts to run using `graph_selected_concepts`.

2. **Implicit Graph Concepts**: The LLM-based orchestrator automatically decides which concepts to run based on the question and available concepts specified in `graph_available_concepts`. If neither parameter is provided, the orchestrator will choose from all concepts in the project.

---

## Examples

### Internal Embeddings + Explicit Graph Concepts

```python
import prometheux_chain as px

# Full control over both embedding and graph operations
result = px.graph_rag(
    project_id="my_project_id",
    question="What companies are located in California?",
    rag_concepts=[
        {"concept": "company", "field_to_embed": "name"},
        {"concept": "location", "field_to_embed": "city"}
    ],
    graph_selected_concepts=["company", "location"]
)
```

### External Embeddings + Implicit Graph Concepts

```python
import prometheux_chain as px

# Provide your own embeddings, let orchestrator choose graph concepts
rag_records = {
    "company": [["Apple", "Google", "Microsoft"]],
    "location": [["Redwood City, CA", "Mountain View, CA", "Redmond, WA"]]
}

result = px.graph_rag(
    project_id="my_project_id",
    question="Which companies are in California?",
    rag_records=rag_records
    # No graph parameters specified - orchestrator will choose from all project concepts
)
```

### Internal Embeddings + Implicit Graph Concepts

```python
import prometheux_chain as px

# Control embeddings, let orchestrator choose graph concepts
result = px.graph_rag(
    project_id="my_project_id",
    question="Find companies in California",
    rag_concepts=[
        {"concept": "location", "field_to_embed": "city"}
    ]
    # No graph parameters specified - orchestrator will choose from all project concepts
)
```

### External Embeddings + Explicit Graph Concepts

```python
import prometheux_chain as px

# Provide your own embeddings, specify graph concepts
rag_records = {
    "company": [["Apple", "Google", "Microsoft"]]
}

result = px.graph_rag(
    project_id="my_project_id",
    question="Which companies are in California?",
    rag_records=rag_records,
    graph_selected_concepts=["location"]
)
```



---

## Complete Workflow Example

**Use Case**: Employee recommendation system that finds the most suitable employees for new projects by combining semantic search of project topics with graph analysis of team-employee-project relationships.

```python
import prometheux_chain as px
import os

# Set up authentication and configuration
os.environ['PMTX_TOKEN'] = 'my_pmtx_token'
px.config.set('JARVISPY_URL', "https://api.prometheux.ai/jarvispy/[my_organization]/[my_username]")


# Create a project
project_id = px.save_project(project_name="graphrag_demo")


# Define and save concepts
concept_logic = """
contributions_input("Phoenix","graph RAG for internal knowledge discovery; knowledge graphs; explainable retrieval; provenance",1001).
contributions_input("Phoenix","graph RAG for internal knowledge discovery; knowledge graphs; explainable retrieval; provenance",1002).
contributions_input("Phoenix","graph RAG for internal knowledge discovery; knowledge graphs; explainable retrieval; provenance",1004).
contributions_input("Phoenix","graph RAG for internal knowledge discovery; knowledge graphs; explainable retrieval; provenance",1015).
contributions_input("Atlas","hybrid retrieval; vector search; BM25 + dense ranking; semantic search platform",1002).
contributions_input("Atlas","hybrid retrieval; vector search; BM25 + dense ranking; semantic search platform",1005).
contributions_input("Atlas","hybrid retrieval; vector search; BM25 + dense ranking; semantic search platform",1009).
contributions_input("Beacon","chatbot assistants; retrieval-augmented QA; tool use; RAG workflows; grounding",1009).
contributions_input("Beacon","chatbot assistants; retrieval-augmented QA; tool use; RAG workflows; grounding",1001).
contributions_input("Beacon","chatbot assistants; retrieval-augmented QA; tool use; RAG workflows; grounding",1002).
contributions_input("Beacon","chatbot assistants; retrieval-augmented QA; tool use; RAG workflows; grounding",1004).
contributions_input("Helios","data lineage; entity resolution; metadata graph; data catalog; governance",1006).
contributions_input("Helios","data lineage; entity resolution; metadata graph; data catalog; governance",1011).
contributions_input("Helios","data lineage; entity resolution; metadata graph; data catalog; governance",1001).
contributions_input("Helios","data lineage; entity resolution; metadata graph; data catalog; governance",1014).
contributions_input("Keystone","knowledge base consolidation; schema alignment; ontology mapping; knowledge graphs",1003).
contributions_input("Keystone","knowledge base consolidation; schema alignment; ontology mapping; knowledge graphs",1001).
contributions_input("Keystone","knowledge base consolidation; schema alignment; ontology mapping; knowledge graphs",1006).
contributions_input("Quasar","real-time recommendations; low-latency ranking; event streaming; approximate nearest neighbors",1008).
contributions_input("Quasar","real-time recommendations; low-latency ranking; event streaming; approximate nearest neighbors",1002).
contributions_input("Quasar","real-time recommendations; low-latency ranking; event streaming; approximate nearest neighbors",1006).
contributions_input("Triton","MLOps; model registry; deployment; feature store; ML monitoring",1012).
contributions_input("Triton","MLOps; model registry; deployment; feature store; ML monitoring",1008).
contributions_input("Triton","MLOps; model registry; deployment; feature store; ML monitoring",1011).
contributions_input("Triton","MLOps; model registry; deployment; feature store; ML monitoring",1006).
contributions_input("Meridian","time-series analytics; anomaly detection; monitoring; forecasting",1011).
contributions_input("Meridian","time-series analytics; anomaly detection; monitoring; forecasting",1014).
contributions_input("Meridian","time-series analytics; anomaly detection; monitoring; forecasting",1012).
contributions_input("Nova","onboarding content; personalization; growth experiments; content targeting",1004).
contributions_input("Nova","onboarding content; personalization; growth experiments; content targeting",1010).
contributions_input("Nova","onboarding content; personalization; growth experiments; content targeting",1005).
contributions_input("Sentinel","privacy risk detection; PII redaction; policy-based access control; differential privacy",1007).
contributions_input("Sentinel","privacy risk detection; PII redaction; policy-based access control; differential privacy",1013).
contributions_input("Sentinel","privacy risk detection; PII redaction; policy-based access control; differential privacy",1012).
contributions_input("Orion","document classification; zero-shot NLP; content moderation; topic modeling",1003).
contributions_input("Orion","document classification; zero-shot NLP; content moderation; topic modeling",1015).
contributions_input("Orion","document classification; zero-shot NLP; content moderation; topic modeling",1007).
contributions_input("Aurora","A/B testing platform; experiment analysis; causal inference; uplift modeling",1010).
contributions_input("Aurora","A/B testing platform; experiment analysis; causal inference; uplift modeling",1004).
contributions_input("Aurora","A/B testing platform; experiment analysis; causal inference; uplift modeling",1008).

contributions(Project_name,Project_topic,Employee_id) :- 
    contributions_input(Project_name,Project_topic,Employee_id).

@output("contributions").
"""
px.save_concept(project_id=project_id, concept_logic=concept_logic)


concept_logic = """
teams_employees_input("Research",1001,"Alice Nguyen").
teams_employees_input("Research",1003,"Carol Bianchi").
teams_employees_input("Research",1009,"Iris Leone").
teams_employees_input("Research",1015,"Olga Sartori").
teams_employees_input("Research",1016,"Sara Moretti").
teams_employees_input("Engineering",1002,"Bob Rossi").
teams_employees_input("Engineering",1005,"Eve Marino").
teams_employees_input("Engineering",1008,"Hugo Rinaldi").
teams_employees_input("Engineering",1012,"Lara Vitale").
teams_employees_input("Engineering",1017,"Paolo Gatti").
teams_employees_input("Data Platform",1006,"Franco Greco").
teams_employees_input("Data Platform",1011,"Kai Romano").
teams_employees_input("Data Platform",1014,"Nico Ferraro").
teams_employees_input("Data Platform",1018,"Ugo Marchetti").
teams_employees_input("Marketing",1004,"Davide Conti").
teams_employees_input("Marketing",1010,"Jamal Ricci").
teams_employees_input("Marketing",1019,"Valentina Russo").
teams_employees_input("Privacy",1007,"Gina Esposito").
teams_employees_input("Privacy",1013,"Mina De Luca").
teams_employees_input("Privacy",1020,"Tara Bellini").

teams_employees(Team_name,Employee_id,Employee_name) :- 
    teams_employees_input(Team_name,Employee_id,Employee_name).

@output("teams_employees").
"""
px.save_concept(project_id=project_id, concept_logic=concept_logic)


concept_logic = """
projects(Project_name,Project_topic) :- 
    contributions(Project_name,Project_topic,Employee_id).

@output("projects").
"""
px.save_concept(project_id=project_id, concept_logic=concept_logic)


concept_logic = """
node("project",Project_name,[]) :- 
    contributions(Project_name,Project_topic,Employee_id).
node("team",Team_name,[]) :- 
    teams_employees(Team_name,Employee_id,Employee_name).
node("employee",Employee_id,[Employee_name]) :- 
    teams_employees(Team_name,Employee_id,Employee_name).

@output("node").
"""
px.save_concept(project_id=project_id, concept_logic=concept_logic)


concept_logic = """
edge("contributed_to",Employee_id,Project_name) :- 
    contributions(Project_name,Project_topic,Employee_id).
edge("works_in",Employee_id,Team_name) :- 
    teams_employees(Team_name,Employee_id,Employee_name).

@output("edge").
"""
px.save_concept(project_id=project_id, concept_logic=concept_logic)


concept_logic = """
edge_undirected(Y,X) :- 
    edge(Type,X,Y).
edge_undirected(X,Y) :- 
    edge(Type,X,Y).

path(X,Y,Dist,Path) :- 
    edge_undirected(X,Y),
    projects(X,Project_topic),
    Dist = 1, Path = [Y].

path(X,Z,Dist,Path) :- 
    path(X,Y,OldDist,OldPath), 
    edge_undirected(Y,Z), 
    OldDist <= 2, Visited = collections:contains(OldPath,Z), Visited == #F,
    Dist = OldDist + 1, Path = concat(OldPath,[Z]).

neighbor(Type,Id,Dist,Source,Path) :- 
    path(Source,Id,Dist,Path), 
    node(Type,Id,Attributes).

@output("neighbor").
"""
px.save_concept(project_id=project_id, concept_logic=concept_logic)


concept_logic = """
closest_employee_to_project(Id,Name,Distance) :-
    neighbor("employee",Id,Dist,Source,Path),
    node("employee",Id,Name),
    Distance = mmin(Dist).

@output("closest_employee_to_project").
@post("closest_employee_to_project","orderBy(3)").
"""
px.save_concept(project_id=project_id, concept_logic=concept_logic)


# Perform GraphRAG query
rag_result = px.graph_rag(project_id=project_id,
                question="I'm kicking off a project on knowledge graphs for data governance, which employees do you suggest?",
                rag_concepts=[{"concept": "projects", "field_to_embed": "Project_topic"}],
                graph_available_concepts=["closest_employee_to_project"],
                top_k=3
)
```


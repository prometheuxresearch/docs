# Concepts

### Knowledge Graph

A knowledge graph is a graph in which entities in your business (e.g. Users,
Companies, Wallets) are connected to other entities via relationships.

For instance, user "Alice" "works at" the company "Acme Corp". "Alice" has a
"Wallet" for storing currency.

Using a knowledge graph, we're able to find the amount of currency "Acme Corp"
has by traversing the graph and summing up all the wallets of all users who work
at "Acme Corp".

Typically, knowledge graphs are stored as triples: (Entity A, Relationship,
Entity B). Prometheux doesn't force you to conceptualise of your data in this
way, allowing you to model relationships that involve multiple properties and
entities.

### Data Source

A data source is any structured or semistructured data that you wish to connect
into a knowledge graph.

### Ontology

At the core of Prometheux is an Ontology. This is the set of business rules that
you write to define how the entities in your system relate to each other, and
how entities are connected to your real data.

These rules are written in [**Vadalog**](../vadalog/intro).

### Data Binding

Included in your Ontology is a way to tell Prometheux which data sources power
the entities in your ruleset. In Vadalog, there are specific annotations for
[binding](../vadalog/annotations#bind-mappings-and-qbind) your rules to your
data.

### Reasoning

By processing the rules and data in your Ontology, Prometheux is able to deduce
new facts or specific outcomes by processing your rule program. This processing
is known as **reasoning**.

### Chase Graph

When you ask Prometheux to reason over a set of rules, it performs this
processing by repeatedly _chasing_ the rules in your ruleset until its logical
conclusion.

The steps it takes to get to your answer are known as a [Chase
Graph](../vadalog/explanations-chase-graph), which is a graph of the rules and
data that contributed to the answer. This graph itself is a knowledge graph that
can be explored and analysed.

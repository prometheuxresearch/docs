# Graph Analytics

Prometheux enables powerful graph analytics without requiring a dedicated graph database. You can perform complex graph operations and reasoning over all your relational and NoSQL data sources, making it easy to extract network insights from existing data infrastructure.

For high-performance built-in graph algorithms, see [Graph Functions in Vadalog](/learn/vadalog/graph-analytics). The examples below demonstrate how to implement graph analytics using pure Vadalog rules.

## Transitive Closure

The task of finding out all pairs of nodes in a graph that are connected to each other either directly or indirectly is known as [transitive closure](https://en.wikipedia.org/wiki/Transitive_closure). You might think of this asking if it's possible to fly from some airport to another in one or more direct flights.

```prolog showLineNumbers
edge("a","b").
edge("a","e").
edge("a","f").
edge("b","d").
edge("c","b").
edge("c","e").
edge("d","c").
edge("d","h").
edge("f","g").

% base case: if there is and edge from the node X to the node Y then there is a path from X to Y %
path(X,Y) :- edge(X,Y).

% recursive case: if there is a path from the node X to the node Y and there is an edge from the node Y to the node Z, then there is a path from the node X to the node Z %
path(X,Z) :- path(X,Y),edge(Y,Z).

@output("path").
```

After execution, the relation `path` contains all connected node pairs, showing both direct and indirect connections in the graph.

## Degree Centrality

Degree centrality measures the importance of a node based on the number of edges connected to it. This is a fundamental metric in network analysis that helps identify the most connected or influential nodes in a graph.

```prolog showLineNumbers
% Create undirected edges from directed edges
edge_undirected(X,Y) :- edge(X,Y).
edge_undirected(Y,X) :- edge(X,Y).

% Define all nodes in the graph
node(X) :- edge_undirected(X,Y).

% Count the total number of nodes
num_nodes(Num) :- node(X), Num = mcount(). 

% Calculate the degree of each node
node_degree(N1,Degree) :- edge_undirected(N1,N2), Degree = mcount().

% Calculate normalized degree centrality for each node
degree_centrality(N,DC) :- 
    node_degree(N,Degree),
    num_nodes(Num),
    Nodes = Num-1,
    DC = Degree/Nodes.

@post("degree_centrality", "orderby(-2)").
```

The degree centrality is normalized by dividing by `N-1` (where N is the total number of nodes), producing values between 0 and 1. The `@post` annotation orders the results by degree centrality in descending order, making it easy to identify the most central nodes in your network.


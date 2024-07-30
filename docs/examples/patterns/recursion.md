# Recursion

Recursion is the workhorse of Prometheux, and is a pattern that occurs naturally
in many situations. In all recursive cases, there is :

1. a recursive case, where a predicate is derived by itself, and
2. a base case, which must not be derivable by itself, allowing the recursion to terminate.

Consider a graph of nodes and edges between them. A path can be defined as:

1. A simple edge between 2 nodes.
2. The list of such edges between any 2 nodes, via N-2 other nodes.

```prolog showLineNumbers
path(Start, End) :- edge(Start, End). % Base case
path(Start, End) :- path(Start, Via), edge(Via, End). % Recursive case
```

See how `path` can be a simple hop from one node to another, or requires
2 hops (via 1 intermediate node), or via 3 hops (via 2 intermediate nodes).

### Transitive Closure

To find all the pairwise connections between all others nodes in a graph:

// add aimage here

```prolog showLineNumbers
% input company graph, described with edges
% there is an edge from the node 1 to the node 2
edge(1,2).
% there is an edge from the node 2 to the node 3
edge(2,3).
edge(1,4).
edge(4,3).
edge(1,6).
edge(6,3).
edge(3,7).
edge(6,7).
edge(4,5).
edge(5,7).
edge(7,1).

% base case: if there is and edge from the node X to the node Y then there is a path from X to Y %
path(X,Y) :- edge(X,Y).

% recursive case: if there is a path from the node X to the node Y and there is an edge from the node Y to the node Z, then there is a path from the node X to the node Z %
path(X,Z) :- path(X,Y),edge(Y,Z).

@output("path").
```

After execution, the relation `path` contains the following tuples:

```
% Output of path(X,Z)
path(4,5).
path(1,2).
path(1,4).
path(1,6).
path(2,3).
path(4,3).
path(6,3).
path(7,1).
path(3,7).
path(6,7).
path(5,7).
path(1,5).
path(2,7).
path(7,4).
path(1,3).
path(1,7).
path(7,6).
path(6,1).
path(4,7).
path(3,1).
path(7,2).
path(5,1).
path(2,1).
path(3,6).
path(3,4).
path(4,1).
path(7,7).
path(6,4).
path(5,6).
path(5,4).
path(1,1).
path(7,5).
path(7,3).
path(6,6).
path(6,2).
path(3,2).
path(5,2).
path(3,3).
path(4,4).
path(6,5).
path(5,3).
path(2,4).
path(2,2).
path(3,5).
path(4,6).
path(4,2).
path(2,6).
path(5,5).
path(2,5).
```

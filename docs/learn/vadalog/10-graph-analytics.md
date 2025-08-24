# Graph Analytics and Pre‑Defined Functions in Vadalog

## Why graph analytics inside a reasoning language?
Many real‑world knowledge‑management tasks (supply‑chain optimisation, fraud detection, recommendation, etc.) are **both** graph‑shaped **and** rule‑driven.  
Vadalog lets you run industrial‑strength **graph algorithms** and **logical reasoning** in the same declarative program.  
Execution is automatically parallel and distributed.

## Using Graph Functions
A graph algorithm appears as a *function literal* that starts with `#` and lives in a rule body:

```prolog
tc_function(X,Y)  :-  #TC(edge).          % transitive closure on edge/2
asp_function(X,Y,Z) :-  #ASP(edge).         % all‑shortest paths on weighted edge/3
```

Variables on the head of the rule with the function receive the algorithm’s results.  

## Built‑in graph function catalogue

| Function | Problem solved | Input predicate (arity) | Output variables | Notes |
|----------|----------------|-------------------------|------------------|-------|
| `#TC(P)` | **Transitive Closure** – reachability. | `P/2` `edge(U,V)` | `(X,Y)` | Directed graph. No duplicates. |
| `#ASP(P)` | **All‑Shortest Paths** (weighted). | `P/3` `edge(U,V,W)` | `(X,Y,Z)` | Parallel multi‑source Dijkstra. |
| `#SSSP(P,Src)` | **Single‑Source Shortest Path**. | same as `#ASP` plus constant `Src` | `(Y,Dist)` | |
| `#BFS(P)` | **Breadth‑First Levels**. | `P/2` | `(X,Level)` | Unweighted tiers. |
| `#PR(P[,d])` | **PageRank** scores. | `P/2` | `(X,Score)` | Optional damping `d` (default 0.85). |
| `#CC(P)` | **Connected Components** (undirected). | `P/2` | `(X,Comp)` | |
| `#WCC(P)` | **Weakly Connected Components**. | `P/2` | `(X,Comp)` | Treats edges as undirected. |
| `#TRI(P)` | **Triangle Enumeration**. | `P/2` | `(X,Y,Z)` | Unordered triangles. |
| `#BC(P)` | **Betweenness Centrality** (approx.). | `P/2` | `(X,Score)` | Brandes with sampling. |

## Examples

### 1  Transitive closure
```prolog
edge(1,2).
edge(2,3).
edge(3,4).
edge(4,1).

tc_function(X,Y) :- #TC(edge).
@output("tc_function").
```

### 2  All shortest paths
```prolog
edge(1,2,9).
edge(2,3,5).
edge(3,4,6).
edge(4,1,8).

asp_function(X,Y) :- #ASP(edge).
@output("asp_function").
```

### Reasoning + Graph Analytics

```prolog
edge_large(1,2,9).
edge_large(3,4,6).

edge_short(2,3,2).
edge_short(4,1,1).

unweighted_edge(1,5).
unweighted_edge(5,2).

edge(X,Y,Z) :- edge_large(X,Y,Z).
edge(X,Y,Z) :- edge_short(X,Y,Z).
edge(X,Y,1) :- unweighted_edge(X,Y). % We assign a default distance = 1

asp_function(X,Y,Z) :- #ASP(edge).
max_asp(X,Y,M) :- asp_function(X,Y,Z), M = mmax(Z).
@output("max_asp").
```


```prolog
highly_connected(Z) :-
      vertex(Z),
      #PR(edge)(Z,Score),
      Score > 0.02.

@output("highly_connected").
```

---
slug: /learn/vadalog/graph-analytics
---

# Graph Analytics and Pre‑Defined Functions in Vadalog

## Why graph analytics inside a reasoning language?
Many real‑world knowledge‑management tasks (supply‑chain optimisation, fraud detection, recommendation, etc.) are **both** graph‑shaped **and** rule‑driven.  
Vadalog lets you run industrial‑strength **graph algorithms** and **logical reasoning** in the same declarative program.  
Execution is automatically parallel and distributed.

## Using Graph Functions
A graph algorithm appears as a *function literal* that starts with `#` and lives in a rule body:

```prolog
tc_function(X,Y)  :-  #TC(edge).           % transitive closure on edge/2
paths_function(X,Y) :- #PATHS(edge).       % all paths with default options
asp_function(X,Y,Z) :-  #ASP(edge).        % all‑shortest paths on weighted edge/3
```

Variables on the head of the rule with the function receive the algorithm’s results.  

## Built‑in graph function catalogue

| Function | Problem solved | Input predicate (arity) | Output variables | Notes |
|----------|----------------|-------------------------|------------------|-------|
| `#TC(P)` | **Transitive Closure** – reachability. | `P/2` `edge(U,V)` | `(X,Y)` | Directed graph. Includes self-loops from cycles. |
| `#PATHS(P[,V[,S[,A[,D]]]])` | **All Paths** with configurable options. | `P/2` `edge(U,V)` + optional params | `(X,Y,Visited)` or `(X,Y)` | All params optional. `V=#T` computes visited (default `#F`), `S=#T` includes self-loops (default `#F`), `A=#T` all paths (default `#F`), `D=N` max depth (default `-1` = unlimited). |
| `#ASP(P)` | **All‑Shortest Paths** (weighted). | `P/3` `edge(U,V,W)` | `(X,Y,Z)` | Parallel multi‑source Dijkstra. Can include self-loops from cycles. |
| `#SSSP(P,Src)` | **Single‑Source Shortest Path**. | same as `#ASP` plus constant `Src` | `(Y,Dist)` | |
| `#BFS(P)` | **Breadth‑First Levels**. | `P/2` | `(X,Level)` | Unweighted tiers. |
| `#PR(P[,d])` | **PageRank** scores. | `P/2` | `(X,Score)` | Optional damping `d` (default 0.85). |
| `#CC(P)` | **Connected Components**. | `P/2` | `(X,Comp)` | For undirected graphs (assumes edges are symmetric). |
| `#WCC(P)` | **Weakly Connected Components**. | `P/2` | `(X,Comp)` | For directed graphs – ignores edge direction. |
| `#TRI(P)` | **Triangle Enumeration**. | `P/2` | `(X,Y,Z)` | Unordered triangles. |
| `#BC(P)` | **Betweenness Centrality** (approx.). | `P/2` | `(X,Score)` | Brandes with sampling. |

## Examples

### 1  Transitive closure
```prolog
edge(1,2).
edge(2,3).
edge(3,4).
edge(4,1).

tc_function(X,Y) :- #TC(edge).
@output("tc_function").
```
**Output**: All reachable pairs including self-loops from cycles: `(1,2), (2,3), (3,4), (4,1), (1,3), (2,4), (3,1), (4,2), (1,4), (2,1), (3,2), (4,3), (1,1), (2,2), (3,3), (4,4)` – 16 tuples total.

### 2  PATHS function with configurable options

```prolog
edge(1,2).
edge(2,3).
edge(3,1).

% Default behavior (no parameters - same as all defaults)
paths_default(X,Y) :- #PATHS(edge).

% Basic paths without visited tracking (explicit)
paths_basic(X,Y) :- #PATHS(edge, #F).

% Paths with visited nodes tracking (simple paths only)
paths_visited(X,Y,Visited) :- #PATHS(edge, #T).

% Paths with self-loops enabled
paths_with_loops(X,Y) :- #PATHS(edge, #F, #T).

% Paths with max depth limit (only 1 hop)
paths_depth1(X,Y) :- #PATHS(edge, #F, #F, #F, 1).

% Paths with visited tracking and max depth 2
paths_visited_depth2(X,Y,V) :- #PATHS(edge, #T, #F, #F, 2).

@output("paths_default").
@output("paths_basic").
@output("paths_visited").
@output("paths_with_loops").
@output("paths_depth1").
@output("paths_visited_depth2").
```

**`paths_default` Output**: All reachable pairs including self-loops from cycles (using defaults): `(1,2), (2,3), (3,1), (1,3), (2,1), (3,2), (1,1), (2,2), (3,3)` – 9 tuples.

**`paths_basic` Output**: Same as `paths_default` – 9 tuples.

**`paths_visited` Output**: Only simple acyclic paths: `(1,2,[1,2]), (2,3,[2,3]), (3,1,[3,1]), (1,3,[1,2,3]), (2,1,[2,3,1]), (3,2,[3,1,2])` – 6 tuples. Each includes visited nodes.

**`paths_with_loops` Output**: Same as `paths_basic` – 9 tuples.

**`paths_depth1` Output**: Only direct edges: `(1,2), (2,3), (3,1)` – 3 tuples.

**`paths_visited_depth2` Output**: Paths up to 2 hops with visited tracking: `(1,2,[1,2]), (2,3,[2,3]), (3,1,[3,1]), (1,3,[1,2,3]), (2,1,[2,3,1]), (3,2,[3,1,2])` – 6 tuples.

### 3  All shortest paths
```prolog
edge(1,2,9).
edge(2,3,5).
edge(3,4,6).
edge(4,1,8).

asp_function(X,Y,Z) :- #ASP(edge).
@output("asp_function").
```

### 4  Connected Components

#### 4a. Simple disconnected graph
```prolog
% Two separate components: {1,2,3} and {4,5}
edge_raw(1,2).
edge_raw(2,3).
edge_raw(4,5).

% Make edges undirected (symmetric)
edge(X,Y) :- edge_raw(X,Y).
edge(Y,X) :- edge_raw(X,Y).

cc(X,C) :- #CC(edge).
@output("cc").
```
**Output**: Each node mapped to its component array. For example: `(1, [1,2,3]), (2, [1,2,3]), (3, [1,2,3]), (4, [4,5]), (5, [4,5])`.

#### 4b. Cyclic graph
```prolog
% Single component with cycle: {1,2,3,4}
edge(1,2).
edge(2,3).
edge(3,4).
edge(4,1).

cc(X,C) :- #CC(edge).
@output("cc").
```
**Output**: All nodes in one component: `(1, [1,2,3,4]), (2, [1,2,3,4]), (3, [1,2,3,4]), (4, [1,2,3,4])`.

#### 4c. Multiple disconnected components
```prolog
% Three separate components
edge(1,2).
edge(3,4).
edge(5,6).

cc(X,C) :- #CC(edge).
@output("cc").
```
**Output**: Three components: `(1, [1,2]), (3, [3,4]), (5, [5,6])`.

### 5  Connected Components: CC vs WCC

```prolog
% Directed edges forming two components: {1,2} and {3,4}
directed_edge(1,2).
directed_edge(3,4).

% For CC: make the graph undirected by adding symmetric edges
undirected_edge(X,Y) :- directed_edge(X,Y).
undirected_edge(X,Y) :- directed_edge(Y,X).

% CC expects undirected (symmetric) edges
cc_result(X,C) :- #CC(undirected_edge).

% WCC works directly on directed edges (ignores direction)
wcc_result(X,C) :- #WCC(directed_edge).

@output("cc_result").
@output("wcc_result").
```
**Both outputs** produce the same components: `{1,2}` and `{3,4}`.

**Key difference**:
- **`#CC`**: Expects edges to already be symmetric (undirected). You must explicitly create `edge(X,Y)` and `edge(Y,X)` for each undirected edge.
- **`#WCC`**: Designed for directed graphs. Automatically treats `edge(1,2)` as if `edge(2,1)` also exists (ignores direction).

**When to use each**:
- Use **`#CC`** when your graph is naturally undirected (friendships, co-authorship, etc.) and you've made edges symmetric.
- Use **`#WCC`** when your graph is naturally directed (web links, citations, follows) but you want to find components ignoring direction.

## Reasoning + Graph Analytics

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

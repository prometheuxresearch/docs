# Annotations

Annotations are special facts that allow to inject specific behaviors into Vadalog programs.
They can be _stand-alone_, _rule level_ or _fact level_.

Stand-alone annotations adopt the following syntax:

```
@annotationName(p1, …, pn).
```

Rule-level annotations adopt the following syntax:

```
@annotationName(p1, …, pn) a(X) :- b(X,Y),c(Y).
```

Multiple rule-level annotations are also supported:

```
@annotationName1(p1, …, pm) @annotationName2(p1, …, pn) a(X) :- b(X,Y),c(Y).
```

The fact-level annotations adopt the following syntax:

```
@annotationName(p1, …, pn) myFact(1,2,"a").
```

Multiple fact-level annotations are also supported:

```
@annotationName(p1, …, pn) @annotationName2(p1, …, pm) myFact(1,2,"a").
```

They are all prefixed and whitespace-separated (comma "," denotes conjunction and should not be used here).

In all the syntaxes above, `annotationName` indicates the specific annotation and each of them accepts a specific list of parameters. In the following sections we present the supported annotations.

## Input

It specifies that the facts for an atom of the program are imported from an external data source, for example a relational database.

The syntax is the following:

```
@input("atomName").
```

where `atomName` is the atom for which the facts have to be imported from an external data source.

It is assumed that an atom annotated with `@input`:

1. never appears as the head of any rule
2. it is never used within an `@output` annotation.

The full details of the external source must be specified with the `@bind`, `@mapping` and `@qbind` annotations.

## Output

It specifies that the facts for an atom of the program will be exported to an external target, for example the standard output or a relational database.

The syntax is the following:

```
@output("atomName").
```

where `atomName` is the atom for which the facts have to be exported into an external target.

It is assumed that an atom annotated with `@output`:

1. does not have any explicit facts in the program,
2. is never used within an `@input` annotation.

If the `@output` annotation is used without any `@bind` annotation, it is assumed that the default target is the standard output. Annotations `@bind` and `@mapping` can be used to customize the target system.

## Bind, Mappings and Qbind

These annotations (`@bind`, `@mapping`, `@qbind`) allow to customize the data sources for the `@input` annotation or the targets for the `@output` annotation.

### @bind

`@bind` binds an input or output atom to a source.
The syntax for `@bind` is the follows:

```
@bind("atomName","data source","outermost container","innermost container").
```

where `atomName` is the atom we want to bind, `data source` is the name of a source defined in the Vadalog configuration, `outermost container` is a container in the data source (e.g., a schema in a relational database), `innermost container` is a content in the data source (e.g. a table in a relational database).

Let's take a look at this example:

```prolog showLineNumbers
@input("m").
@input("q").
@output("m").
@bind("m","postgres","doctors_source","Medprescriptions").
@bind("q","sqlite","doctors_source","Medprescriptions").
m(X) :- b(X),q(X).
```

This example reads the facts for `m` from a Postgres data source, specifically from
schema `doctors_source` and table `Metprescriptions`, reads facts for `q` from a
SQLite (in SQLite the schema is ignored) data source and performs a join.

### bind multiple sources to an input predicate

You can bind multiple external sources (csv, postgres, sqlite, neo4j, …) to a single input predicate. In this example we have a graph partitioned in a csv file and a postgres database and we bind them to the predicate `edge`. As a result the facts from the two sources are merged into `edge`.

```prolog showLineNumbers
@input("edge").
@output("path").
path(X,Y) :- edge(X,Y).
path(X,Z) :- edge(X,Y),path(Y,Z).
@bind("edge","csv","path/to/myCsv1/","graph_partition_1.csv").
@bind("edge","postgres","graph_source_db","graph_partition_2_table").

@output("path").
```

### @mapping

`@mapping` maps specific columns of the input/output source to a position of an atom.
An atom that appears in a `@mapping` annotation must also appear in a `@bind` annotation.

The syntax is the following:

```
@mapping("atomName",positionInAtom,"columnName","columnType").
```

where `atomName` is the atom we want to map, `positionInAtom` is an integer (from 0)
denoting the position of the atom that we want to map; `columnName` is the name of the column in the source (or equivalent data structure), `columnType` is an indication of the type in the source. The following types can be specified: _string_, _int_, _double_, _boolean_ and _date_.

In this example, we map the columns of the `Medprescriptions` table:

```
@input("m").
@bind("m","postgres","doctors_source","Medprescriptions").
@mapping("m",0,"id","int").
@mapping("m",1,"patient","string").
@mapping("m",2,"npi","int").
@mapping("m",3,"doctor","string").
@mapping("m",4,"spec","string").
@mapping("m",5,"conf","int").
```

Observe that _mappings can be omitted_ for both `@input` and `@output` atoms. In such case they are automatically inferred from the source (target); the result can be however unsatisfactory depending on the sources, since some of them do not support positional reference to the attributes.

### @qbind

`@qbind` binds an input atom to a source, generating the facts for the atom as the result of a query executed on the source.

The syntax is the following:

```
@qbind("atomName","data source","outermost container","query").
```

where `atomName` is the atom we want to bind, `data source` is the name of a source defined in the Vadalog configuration, `outermost container` is a container in the data source (e.g., a schema in a relational database), `query` is a query in the language supported by the source (e.g., SQL for relational databases).

Consider this example:

```
@qbind("t","postgres","vada","select * from ""TestTable"" where id between 1 and 2").
```

Here we bind atom `t` to the data source postgres, selecting a specific content from the table `TestTable`.

You can also use parametric `@qbind`, for example:

```
@qbind("t","postgres","vada","select * from ""TestTable"" where id = ${1}").
```

where `${1}` is a parameter, which will have the values of the first input field `t`.
Parametric `@qbind` should be used in joins with other atoms.

You can also use multiple parameters within a parametric `@qbind`:

```
@qbind("t","postgres","vada","select * from ""TestTable"" where id = ${1} and field = ${2}").
```

where `${1}` and `${2}` are the first and second parameters of all `t` results.

## Post-processing

This category of annotations include a set of post-processing operations that can be applied to facts of atoms annotated with @output before exporting the result into the target.
Observe that also if the result is simply sent to the standard output, the post-processing is applied before.

The syntax is the following:

```
@post("atomName","post processing directive").
```

where `atomName` is the name of the atom (which must also be annotated with `@output`) for which the post-processing is intended and `post processing directive` is a specification of the post-processing operation to be applied.

Multiple post-processing annotations can be used for the same atom, in case multiple transformations are desired.

In the following sections we give the details.

### Order by

It sorts the output over some positions of the atom.

The syntax is the following:

```
@post("atomName", "orderby(p1, …, pn)").
```

where `atomName` is the atom to be sorted, `p1, …, pn` are integers denoting a valid position in atomName (starting from 1). The sorting is orderly applied on the various positions. A position can be prefixed with the minus sign (-) to denote descending sorting.

For the various data types the usual order relations are assumed (to be extended).

Consider this example:

```prolog showLineNumbers {6}
t(1,"b",5).
t(1,"a",1).
t(1,"c",1).
p(X,Y,Z) :- t(X,Y,Z).
@output("p").
@post("p","orderby(3,-2)").
```

We order by the third position (ascending) and, for the same value of the third position, by descending values of the second position.

The expected result is:

```
p(1,"c",1). p(1,"a",1). p(1,"b",5).
```

### Min

It calculates the minimum value for one ore more positions on an atom, grouping by the other positions.

The syntax is the following:

```
@post("atomName","min(p1, …, pn)").
```

where `atomName` is the atom at hand, `p1, …, pn` are integers denoting a valid position in atomName (starting from 1).

```prolog showLineNumbers {6}
t(1,"b",5).
t(1,"b",1).
t(1,"c",1).
p(X,Y,Z) :- t(X,Y,Z).
@output("p").
@post("p","min(3)").
```

The expected result is:

```
p(1,"b",1).
p(1,"c",1).
```

Note that the min value is computed according to the lexicographic order over tuples obtained by projecting on the positions in the post-processing annotation.

```prolog showLineNumbers {6}
t(1,"b",1).
t(2,"c",1).
t(1,"a",1).
q(X,Y,Z) :- t(X,Y,Z).
@output("q").
@post("q","min(1,2)").
```

The expected result is

```
p(1,"a",1).
```

Indeed, all the three tuples `(1,"b")`, `(2,"c")` and `(1,"a")` fall within one group, and `(1,"a")` is a minimal tuple among them according to the lexicographic order.

### Max

It calculates the maximum value for one ore more positions on an atom, grouping by the other positions.

The syntax is the following:

```
@post("atomName","max(p1, …, pn)").
```

where `atomName` is the atom at hand, `p1, …, pn` are integers denoting a valid position in atomName (starting from 1).

```prolog showLineNumbers {6}
t(1,"b",5).
t(1,"b",1).
t(1,"c",1).
p(X,Y,Z) :- t(X,Y,Z).
@output("p").
@post("p","max(3)").
```

The expected result is:

```
p(1,"b",5).
p(1,"c",1).
```

Note that the max value is computed according to the lexicographic order over tuples obtained by projecting on the positions in the post-processing annotation.

```prolog showLineNumbers {6}
t(2,"b",1).
t(1,"c",1).
t(2,"a",1).
q(X,Y,Z) :- t(X,Y,Z).
@output("q").
@post("q","max(2,1)").
```

Then the expected result is

```
p(1,"c",1).
```

Indeed, all the three tuples `("b",2)`, `("c",1)` and `("a",2)` fall within one group, and `("c",1)` is a maximal tuple among them according to the lexicographic order.

### Argmin

It groups the facts of an atom according to certain positions and, for each group, it returns
only the facts that minimise a specific position.

The syntax is the following:

```
@post("atomName", "argmin(p, <p1, …, pn>)").
```

where `atomName` is the atom at hand, p is the position to minimise (from 1) and `p1, …, pn` are integers denoting the positions that individuate a specific group.

```prolog showLineNumbers {7,8}
f(1,3,"a", 3).
f(4,3,"a", 5).
f(2,6,"b", 7).
f(2,6,"b", 8).
f(3,6,"b", 9).
@output("g").
@post("g","argmin(4,<2,3>)").
@post("g","orderby(1)").

g(X,Y,Z,K) :- f(X,Y,Z,K).
```

The expected result is:

```
g(1,3,"a",3).
g(2,6,"b",7).
```

### Argmax

It groups the facts of an atom according to certain positions and, for each group, it returns
only the facts that maximise a specific position.

The syntax is the following:

```
@post("atomName", "argmax(p, <p1, …, pn>)").
```

where `atomName` is the atom at hand, `p` is the position to maximise (from 1) and `p1, …, pn` are integers denoting the positions that individuate a specific group.

```prolog showLineNumbers {8,9}
f(1,3,"a", 3).
f(4,3,"a", 5).
f(2,6,"b", 7).
f(2,6,"b", 8).
f(3,6,"b", 9).
g(X,Y,Z,K) :- f(X,Y,Z,K).
@output("g").
@post("g","argmax(4,<2,3>)").
@post("g","orderby(1)").
```

The expected result is:

```
g(3,6,"b",9).
g(4,3,"a",5).
```

### Unique

In reasoning with Vadalog Parallel, there are particular situations where duplicate facts for a specific atom may occur in the output. In general, there is no guarantee that output atoms are duplicate-free.

In case such guarantee is required, the unique post-processing annotation can be used. The syntax follows:

```
@post("atomName", "unique").
```

where `atomName` is the name of the atom at hand.

### Limit

Sometimes it is useful to limit an output relation to a fixed number of tuples.
One can achieve this in two different way with the use of the post-processing
annotations `limit` as shown below.

```
@post("atomName", "limit(N)").
```

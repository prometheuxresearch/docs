# Annotations

Annotations are special facts that allow to inject specific behaviors into
Vadalog programs. They can be _stand-alone_, _rule level_ or _fact level_.

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

They are all prefixed and whitespace-separated (comma "," denotes conjunction
and should not be used here).

In all the syntaxes above, `annotationName` indicates the specific annotation
and each of them accepts a specific list of parameters. In the following
sections we present the supported annotations.

## @input

It specifies that the facts for an atom of the program are imported from an
external data source, for example a relational database.

The syntax is the following:

```
@input("atomName").
```

where `atomName` is the atom for which the facts have to be imported from an
external data source.

It is assumed that an atom annotated with `@input`:

1. never appears as the head of any rule
2. it is never used within an `@output` annotation.

The full details of the external source must be specified with the `@bind`,
`@mapping` and `@qbind` annotations.

## @output

It specifies that the facts for an atom of the program will be exported to an
external target, for example the standard output or a relational database.

The syntax is the following:

```
@output("atomName").
```

where `atomName` is the atom for which the facts have to be exported into an
external target.

It is assumed that an atom annotated with `@output`:

1. does not have any explicit facts in the program,
2. is never used within an `@input` annotation.

If the `@output` annotation is used without any `@bind` annotation, it is
assumed that the default target is the standard output. Annotations `@model`,
`@bind` and `@mapping` can be used to customize the target system.

## @model

The `@model` annotation is used to create and enforce a schema for a predicate,
ensuring the data adheres to a specified structure. This annotation not only
supports simple predicate schema definitions but also extends to handle complex
concepts such as superclass relationships and triple-based entity relationships.

The annotation syntax is as follows:

```
@model("predicate_name", "['field_name:type', 'field_name:type', '...']", "optional_description").
```

- predicate_name: The name of the predicate to which the schema is applied.
- ['field_name:type', 'field_name:type', '...']: A list defining the schema,
      where each argument specifies a field name and its corresponding type.
- `optional_description`: (Optional) A natural language description of the
  predicate, providing a readable explanation of what the predicate represents.

Consider this simple example:

```prolog showLineNumbers {4}
b(1, "2", 1.0, "Davide").
a(A, B, C, D) :- b(A, B, C, D).

@model("a", "['first:string', 'second:string', 'third:double', 'fourth:string']").
@output("a").
```

This imposes a 4-field schema for the predicate a with the following fields and
types:

- first: string
- second: string
- third: double
- fourth: string

#### Workflow

Assume to have a parquet dataset containing the following row:

```prolog
1, "2", 1.0, "Davide"
```

1. Define a schema for the input predicate:

   ```prolog
   @model("b", "['first:int', 'second:string', 'third:double', 'fourth:string']").
   @input("b").
   ```

   This ensures that predicate `b` adheres to the specified schema.

2. Bind the predicate to a data source:

   ```prolog
   @bind("b", "parquet", "src/test/resources/datasets", "dataset")
   ```

   This reads data from the specified Parquet file into predicate `b`.

3. Define and enforce a schema for the output predicate:

   ```prolog
   @output("a")
   @model("a", "['first:int', 'second:int', 'third:double', 'fourth:string']").
   @bind("a", "parquet", "src/test/resources/datasets/", "dataset").
   ```

   This writes the Parquet file and casts the input data type fields to the
   output data type fields int, int, double, and string.

4. Define the rules using the schema-defined predicates:

   ```prolog
   a(A, B, C, D) :- b(A, B, C, D).
   @output("a").
   ```

   This writes the following row in the parquet file:

   ```prolog
   1, 2, 1.0, "Davide"
   ```

### Natural Language Descriptions

You can include a natural language description within the `@model` annotation to
describe what the predicate represents. This description provides human-readable
context for predicates in addition to their schema definition. 

If both a model annotation and a glossary file provide descriptions for a
certain predicate, the description in the glossary file takes precedence.

:::info
You may refer to terms of the predicate, which will be substituted with
values in the chase graph. Predicate terms referred to in this way must be
enclosed in square brackets `[]` in the description. 
:::

**Example**

```prolog {3}
@model("state_path_probability", 
       "['id:string','startState:string','endState:string','prob:double']", 
       "The probability of a series of states with ID [id] from [startState] to [endState] is [prob].").
```

#### Automatic Generation of natural language description

If a model annotation does not include a natural language description for the
predicate and if an [LLM is available](../../sdk/api/config#configuring-llms),
the description will be **automatically generated** during the compilation
phase.

- This autogenerated description is based on the schema and fields defined in
  the model annotation.
- Each time the `.vada` file is compiled, the autogenerated description is
  refreshed, ensuring that it remains up-to-date with any schema changes.


### Superclasses
A superclass in the context of a `@model` annotation allows for the inheritance
of attribute schemas from a base predicate. This feature simplifies the
management of related predicates by allowing common attributes to be defined
once in a superclass predicate.

In order to extend a schema in this way, you must wrap the superclass model in 
parentheses `()`. You can then refer to attributes of the superclass using square
brackets `[]` in the fields definition. 

The syntax is as follows:
`@model("subclass(superclass)", "['id:superclass[id]']")`.


**Example**

Consider a `person` as a superclass and `engineer` as a derived class from
person:

```
@model("person", "['id:int', 'name:string', 'age:int']").
@model("engineer(person)", "['id:person[id]', 'engineerName:person[name]', 'specialty:string']").
```

In this example, `engineer` inherits `id` and `name` fields from person and adds
a new field `specialty`.

Superclasses can also be modelled deeply as follows:

```
@model("superclass_level_1", "['super_field_level_1:type']").

@model("superclass_level_2_1(superclass_level_1)", 
       "['a_field_level_2:superclass_level_1[super_field_level_1]', 'a_field:double']").

@model("superclass_level_2_2(superclass_level_1)", 
      "['a_field:int','a_field_level_2:superclass_level_1[super_field_level_1]']").

@model("subclass(superclass_level_2_2)", 
      "['a_field_0:superclass_level_2_2[a_field_level_2]', 'a_field_1:date', 'a_field_2:superclass_level_2_2[a_field]']").
```

### Triples
Traditional knowledge graphs are modelled using triples, where relationships
 between entities are expressed as a *triple* of `[subject, predicate, object]`.

**Example**

Using `person` and `engineer` entities, a triple relationship can be defined to
capture ownership or control dynamics:

```
@model("(person)manages(engineer)", 
       "['manager:person[name]', 'engineer_managed:engineer[name]', 'responsibility_level:string']").
```

Here, each relationship is expressed through a subject `(person)`, a predicate
`manages`, and an object `(engineer)`, with an additional field describing the
level of responsibility.

:::info
Notice how the actual triple is simply the `manages` relationship, but we've 
added a schema for the level as well. In fact, all relationships between any
number of entities, and having any number of properties, can be modelled in this way.
:::

### Composition

In addition to primitive data types, the `@model` annotation allows a predicate 
to include other predicates as complex data types. This facilitates the modeling of
intricate relationships and nested data structures directly within your schema
definitions, providing a robust mechanism for data integrity and hierarchical
data management.

When defining a predicate that uses composition, one of the fields can be
specified as another predicate. This nested predicate must define a primary key
that identifies its instances uniquely, which is used as the reference key in
the composite predicate.

#### Example

Consider modeling events and states where each event transitions from one state
to another:

```prolog
@model("state", "['state_id(ID):string', 'Type:string', 'Balance:double']").
```
Defines a state with a unique state_id as the primary key.

```prolog
@model("event", "['Id:int', 'Start State:state', 'End State:state', 'Prob:double']").
```

event uses state for both `Start State` and `End State`, with `state_id` serving
as the data type for these fields, implied to be string type due to the primary
key type of state.

#### Vadalog Examples

```prolog {2}
@model("state","['state_id(ID):string', 'Type:string', 'Balance:double']").
@model("event","['Id:int', 'StartState:state', 'EndState:state', 'Prob:double']").
% The next line is optional, since we're not using it an any computation.
@model("out_event","['Start State(ID):string', 'Type:string', 'Balance:double']"). 

event(1, "start state A", "end state A", 0.1).
state("start state A", "positive", 10.0).
state("end state A", "negative", -10.0).

out_event(StartState, EndState, Prob) :- event(Id, StartState, EndState, Prob).
@output("out_event").
```

#### Typed Collections

Composition also allows you to include a predicate as a data type within a
Collection. Specifically, the type of elements within the Collection is
determined by the type of the primary key of the predicate defined within the
brackets.

```prolog {2}
@model("event","['Event Id(ID):string', 'FromState:string', 'ToState:string', 'Prob:double']").
@model("risk","['RiskId:string', 'Events:[event]']").

event("E1", "pbalance", "nbalance", 0.1).
event("~E1", "pbalance", "pbalance", 0.9).
event("E2", "nbalance", "pbalance", 0.2).
event("E3", "nbalance", "lost", 0.8).
event("E4", "lost", "lost", 1.0).
risk("NBRisk", ["E1", "~E1", "E2", "E3", "E4"]).

risk_path_prob(RiskId, StartStateId, StartStateId, NumSteps, Events, Prob) :- 
   risk(RiskId, Events), 
   NumSteps = 1,
   StartStateId = "pbalance", 
   Prob=1.0.

risk_path_prob(RiskId, StartStateId, EndStateId, NumStepsNew, Events, ProbNew) :- 
   risk_path_prob(RiskId, StartStateId, MidStateId, NumStepsOld, Events, ProbOld), 
   event(EventId, MidStateId, EndStateId, ProbEvent), 
   NumStepsNew = NumStepsOld + 1, 
   ProbNew = ProbOld * ProbEvent, 
   IsEventOfRiskInstance = collections:contains(Events, EventId), 
   IsEventOfRiskInstance = #T, 
   NumStepsNew <= 5.

@output("risk_path_prob").
```


## Bind, Mappings and Qbind

These annotations (`@bind`, `@mapping`, `@qbind`) allow to customize the data
sources for the `@input` annotation or the targets for the `@output` annotation.

### @bind

`@bind` binds an input or output atom to a [source](./data-sources). The syntax for `@bind` is the
follows:

```
@bind("atomName","data source","outermost container","innermost container").
```

where `atomName` is the atom we want to bind, `data source` is the name of a
source defined in the Vadalog configuration, `outermost container` is a
container in the data source (e.g., a schema in a relational database),
`innermost container` is a content in the data source (e.g. a table in a
relational database).

Let's take a look at this example:

```prolog showLineNumbers
@input("m").
@input("q").
@output("m").
@bind("m","postgres","doctors_source","Medprescriptions").
@bind("q","sqlite","doctors_source","Medprescriptions").
m(X) :- b(X),q(X).
```

This example reads the facts for `m` from a Postgres data source, specifically
from schema `doctors_source` and table `Metprescriptions`, reads facts for `q`
from a SQLite (in SQLite the schema is ignored) data source and performs a join.

### bind multiple sources to an input predicate

You can bind multiple external sources (csv, postgres, sqlite, neo4j, …) to a
single input predicate. In this example we have a graph partitioned in a csv
file and a postgres database and we bind them to the predicate `edge`. As a
result the facts from the two sources are merged into `edge`.

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

`@mapping` maps specific columns of the input/output source to a position of an
atom. An atom that appears in a `@mapping` annotation must also appear in a
`@bind` annotation.

The syntax is the following:

```
@mapping("atomName",positionInAtom,"columnName","columnType").
```

where `atomName` is the atom we want to map, `positionInAtom` is an integer
(from 0) denoting the position of the atom that we want to map; `columnName` is
the name of the column in the source (or equivalent data structure),
`columnType` is an indication of the type in the source. The following types can
be specified: _string_, _int_, _double_, _boolean_ and _date_.

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

Observe that _mappings can be omitted_ for both `@input` and `@output` atoms. In
such case they are automatically inferred from the source (target); the result
can be however unsatisfactory depending on the sources, since some of them do
not support positional reference to the attributes.

### @qbind

`@qbind` binds an input atom to a source, generating the facts for the atom as
the result of a query executed on the source.

The syntax is the following:

```
@qbind("atomName","data source","outermost container","query").
```

where `atomName` is the atom we want to bind, `data source` is the name of a
source defined in the Vadalog configuration, `outermost container` is a
container in the data source (e.g., a schema in a relational database), `query`
is a query in the language supported by the source (e.g., SQL for relational
databases).

Consider this example:

```
@qbind("t","postgres","vada","select * from ""TestTable"" where id between 1 and 2").
```

Here we bind atom `t` to the data source postgres, selecting a specific content
from the table `TestTable`.

You can also use parametric `@qbind`, for example:

```
@qbind("t","postgres","vada","select * from ""TestTable"" where id = ${1}").
```

where `${1}` is a parameter, which will have the values of the first input field
`t`. Parametric `@qbind` should be used in joins with other atoms.

You can also use multiple parameters within a parametric `@qbind`:

```
@qbind("t","postgres","vada","select * from ""TestTable"" where id = ${1} and field = ${2}").
```

where `${1}` and `${2}` are the first and second parameters of all `t` results.

## Post-processing with @post

This category of annotations include a set of post-processing operations that
can be applied to facts of atoms annotated with @output before exporting the
result into the target. Observe that also if the result is simply sent to the
standard output, the post-processing is applied before.

The syntax is the following:

```
@post("atomName","post processing directive").
```

where `atomName` is the name of the atom (which must also be annotated with
`@output`) for which the post-processing is intended and `post processing
directive` is a specification of the post-processing operation to be applied.

Multiple post-processing annotations can be used for the same atom, in case
multiple transformations are desired.

In the following sections we give the details.

### Order by

It sorts the output over some positions of the atom.

The syntax is the following:

```
@post("atomName", "orderby(p1, …, pn)").
```

where `atomName` is the atom to be sorted, `p1, …, pn` are integers denoting a
valid position in atomName (starting from 1). The sorting is orderly applied on
the various positions. A position can be prefixed with the minus sign (-) to
denote descending sorting.

For the various data types the usual order relations are assumed (to be
extended).

Consider this example:

```prolog showLineNumbers {6}
t(1,"b",5).
t(1,"a",1).
t(1,"c",1).
p(X,Y,Z) :- t(X,Y,Z).
@output("p").
@post("p","orderby(3,-2)").
```

We order by the third position (ascending) and, for the same value of the third
position, by descending values of the second position.

The expected result is:

```
p(1,"c",1). p(1,"a",1). p(1,"b",5).
```

### Min

It calculates the minimum value for one ore more positions on an atom, grouping
by the other positions.

The syntax is the following:

```
@post("atomName","min(p1, …, pn)").
```

where `atomName` is the atom at hand, `p1, …, pn` are integers denoting a valid
position in atomName (starting from 1).

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

Note that the min value is computed according to the lexicographic order over
tuples obtained by projecting on the positions in the post-processing
annotation.

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

Indeed, all the three tuples `(1,"b")`, `(2,"c")` and `(1,"a")` fall within one
group, and `(1,"a")` is a minimal tuple among them according to the
lexicographic order.

### Max

It calculates the maximum value for one ore more positions on an atom, grouping
by the other positions.

The syntax is the following:

```
@post("atomName","max(p1, …, pn)").
```

where `atomName` is the atom at hand, `p1, …, pn` are integers denoting a valid
position in atomName (starting from 1).

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

Note that the max value is computed according to the lexicographic order over
tuples obtained by projecting on the positions in the post-processing
annotation.

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

Indeed, all the three tuples `("b",2)`, `("c",1)` and `("a",2)` fall within one
group, and `("c",1)` is a maximal tuple among them according to the
lexicographic order.

### Argmin

It groups the facts of an atom according to certain positions and, for each
group, it returns only the facts that minimise a specific position.

The syntax is the following:

```
@post("atomName", "argmin(p, <p1, …, pn>)").
```

where `atomName` is the atom at hand, p is the position to minimise (from 1) and
`p1, …, pn` are integers denoting the positions that individuate a specific
group.

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

It groups the facts of an atom according to certain positions and, for each
group, it returns only the facts that maximise a specific position.

The syntax is the following:

```
@post("atomName", "argmax(p, <p1, …, pn>)").
```

where `atomName` is the atom at hand, `p` is the position to maximise (from 1)
and `p1, …, pn` are integers denoting the positions that individuate a specific
group.

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

In reasoning with Vadalog Parallel, there are particular situations where
duplicate facts for a specific atom may occur in the output. In general, there
is no guarantee that output atoms are duplicate-free.

In case such guarantee is required, the unique post-processing annotation can be
used. The syntax follows:

```
@post("atomName", "unique").
```

where `atomName` is the name of the atom at hand.

### Certain

As Vadalog Parallel handles marked nulls, it is possible that the facts of some
output atoms contain such values. Sometimes this may be not desired, for example
when the result needs to be stored into a relational database.

The `certain` post-processing annotation filters out, for a given atom, all the
facts containing any marked nulls.

The syntax is as follows:

```
@post("atomName", "certain").
```

where `atomName` is the name of the atom at hand.

### Limit and Prelimit

Sometimes it is useful to limit an output relation to a fixed number of tuples.
One can achieve this in two different way with the use of the post-processing
annotations `limit` and `prelimit` as shown below.

```
@post("atomName", "limit(N)").
```


##  @Param
The `@param` annotation is used to introduce and define parameters that can be
referenced throughout the rules within a program. Parameters allow for dynamic
values that can be modified without changing the core logic of the program,
making the rules more flexible and reusable.

For parameterization via API refer to
[`evaluateFromRepoWithParams`](https://www.prometheux.co.uk/docs/learn/on-prem/rest-api#evaluatefromrepowithparams).

#### Syntax
```prolog
@param("parameter_name", value).
```

- parameter_name: A string representing the name of the parameter. It should be
  unique within the context of the program.
- value: The value associated with the parameter. This can be any valid value
  type in Vadalog (e.g., integer, string, double, list, etc..).


#### Vadalog examples

#### Filtering Paths Within a Specified Distance Range

```prolog
@param("max_distance", 15).
@param("min_distance", 5).

connection("A", "B", 10).
connection("A", "C", 20).
connection("B", "D", 7).
connection("C", "D", 12).
connection("D", "E", 5).

valid_path(Start, End, Distance) :- 
    connection(Start, End, Distance), 
    Distance >= ${min_distance}, 
    Distance <= ${max_distance}.

@output("valid_path").
@model("valid_path","['Start:string','End:string','Distance:int']").
```

Given the input data and the parameters defined the output is:

```prolog
valid_path("A", "B", 10).
valid_path("B", "D", 7).
valid_path("C", "D", 12).
valid_path("D", "E", 5).
```
These results reflect only those paths where the distance falls within the
specified range between 5 and 15.

#### Filtering Connections Based on Priority Levels

```prolog
@param("priority_levels", [1, 2, 3]).

task("TaskA", "TaskB", 4).
task("TaskA", "TaskC", 2).
task("TaskB", "TaskD", 1).
task("TaskC", "TaskD", 5).

high_priority_task(Start, End, Priority) :- 
    task(Start, End, Priority), 
    AllowedPriorities = ${priority_levels}, 
    IsHighPriority = collections:contains(AllowedPriorities, Priority), 
    IsHighPriority = #T.

@output("high_priority_task").
@model("high_priority_task","['Start:string','End:string','Priority:int']").
```

Given the input data and the parameters defined the output is:

```prolog
high_priority_task("TaskA", "TaskC", 2).
high_priority_task("TaskB", "TaskD", 1).
```

These results reflect only those task connections where the **priority level**
is within the defined priority_levels list **[1, 2, 3]**.
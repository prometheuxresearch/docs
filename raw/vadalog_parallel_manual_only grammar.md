# Vadalog Parallel Manual

## Copyright Information

```plaintext
Copyright (C) 2023 Prometheux. All rights reserved.
```

# Overview

This is a short user manual for **Vadalog Parallel**, the parallel and distributed logic reasoner based on the **Vadalog Language**.

**Vadalog Parallel** is an intelligent data processing system, able to process **logic programs** also known as **ontologies**, expressed in **Vadalog**, a language of the Datalog +/- family.

The processing of such logic programs is also known as **reasoning** and, with AI terminology, we can therefore say that Vadalog Parallel is a **reasoner**.

# Table of Contents

- [The Vadalog language](#the-vadalog-language)
  - [Preliminaries](#preliminaries)
  - [Rules and programs](#rules-and-programs)
  - [Data types](#data-types)
  - [Constants](#constants)
  - [Comments](#comments)
  - [Variables](#variables)
  - [Marked Nulls](#marked-nulls)
- [Rules](#rules)
  - [Linear rules](#linear-rules)
  - [Facts](#facts)
  - [Join rules](#datalog-rules)
  - [Constants within rules](#constants-within-rules)
- [Expressions and operators](#expressions-and-operators)
  - [Operators](#operators)
  - [Single-fact operators](#single-fact-operators)
  - [Monotonic aggregates](#monotonic-aggregates)
  - [Aggregation operators](#aggregation-operators)
  - [Conditions](#conditions)
  - [Assignment](#assignment)
  - [Recursion](#recursion)
  - [Negation](#negation)
- [Annotations](#annotations)
  - [Input](#input)
  - [Output](#output)
  - [Bind, Mappings and Qbind](#bind-mappings-and-qbind)
    - [@bind](#bind)
    - [@mapping](#mapping)
    - [@qbind](#qbind)
    - [@delete](#delete)
    - [@update](#update)
    - [@implement](#implement)
  - [Post-processing](#post-processing)
    - [Order by](#order-by)
    - [Min](#min)
    - [Max](#max)
    - [Argmin](#argmin)
    - [Argmax](#argmax)
    - [Unique](#unique)
    - [Certain](#certain)
    - [Limit and Prelimit](#limit-and-prelimit)
  - [Library imports](#library-imports)
  - [Relaxed Safety](#relaxed-safety)
  - [Modularity](#modularity)
    - [Module](#module)
    - [Include](#include)
- [Data sources](#data-sources)
  - [Relational database source](#relational-database-source)
  - [CSV data source](#csv-data-source)
  - [Neo4j data source](#neo4j-data-source)
- [The Knowledge Base Repository](#the-knowledge-base-repository)
- [Using the Vadalog Parallel](#using-prometheuxengine)
  - [Using the Engine as a Java Library](#using-the-engine-as-a-java-library)
  - [Connecting to the Engine via REST API](#connecting-to-the-engine-via-rest-api)
    - [`evaluate` endpoint](#evaluate-endpoint)
    - [`evaluateFromRepoWithParams` endpoint](#evaluatefromrepowithparams-endpoint)
- [Distributed and Parallel Reasoning](#distributed-and-parallel-dp-reasoning)
  - [Parallel Semi Naive Evaluation](#parallel-semi-naive-evaluation)
  - [Parallel Semi Naive Evaluation](#parallel-semi-naive-aggregate-evaluation-p-sna)
  - [Connectors for external sources](#connectors-for-external-sources)
  - [Configuring Vadalog Parallel](#configuring-prometheux-engine)
    - [Possible values for dist.master](#possible-values-for-distmaster)
    - [Vadalog Parallel with Yarn](#prometheux-engine-with-yarn)
    - [Vadalog Parallel with Kubernetes](#prometheux-engine-with-Kubernetes)

# The Vadalog language

## Preliminaries

Let _C_, _V_, _N_ be sets of **constants**, **variables** or **marked nulls**, respectively.

The elements of such sets are known as **terms**.
A syntactic expression of the form r(t1, t2, ..., tn) is known as **atom**,
where t1, t2, ... tn are terms. An atom is said to be **ground** if it
only contains constants. A ground atom is also known as **fact**.

## Rules and programs

A rule is an expression of the form
`h :- b1, ..., bn` where `b1, ..., bn` are the atoms of the _body_ and `h` is
the atom of the _head_.

The variables in the body are universally quantified, while the variables that appear in the head, but not in the body are existentially quantified.

A successful assignment of all the variables of the body of a rule results in a derivation for the rule head predicate, which is a successful activation of the rule. Vadalog programs use the set semantics, defined in a standard way in presence of existential quantification
by the _chase procedure_.

Let us present some examples of rules.

**Example 1**

```
a(X) :- b(X).
```

It generates facts for atom `a`, given facts for atom `b`. `X` is a variable.

**Example 2**

```
a(X,Z) :- b(X,Y),c(Y,Z).
```

**Example 3**

```
a(X,Z) :- a(X,Y),a(Y,Z).
```

Given two facts for `a`, it generates a third one.

A **Vadalog (logic) program (or ontology)** is a set P of rules and facts.

The following is an example shows a simple Vadalog program.

**Example 4**

```
a(1).
c(1,2).
b(Y,X) :- a(X),c(X,Y).
@output("b").
```

`a(1)` is a fact, `b(Y,X) :- a(X),c(X,Y)` is a rule.
Observe that `@output("b")` is an annotation and specifies
that the facts for b are in the output.

## Data types

The table below shows the data types supported by Vadalog, along with the literals for the respective constants.

| Data type | Examples of constant literals             |
| --------- | ----------------------------------------- |
| string    | "string literal", "a string", ""          |
| integer   | 1, 3, 5, -2, 0                            |
| double    | 1.22, 1.0, -2.3, 0.0                      |
| date      | 2012-10-20, 2013-09-19 11:10:00           |
| boolean   | #T, #F                                    |
| set       | {1}, {1,2}, {}, {"a"}, {2.0,30}           |
| list      | \[1\], \[1,2\], \[\], \["a"\], \[2.0,30\] |
| unknown   | /                                         |

## Comments

Line comments in Vadalog program are denoted by `%`. The syntax is then the following:

```
% this is a comment
```

## Variables

Variables have different interpretations in different programming paradigms.
In imperative languages, they are essentially memory locations that may have some contents
and the contents may change over time.

In algebra or physics, a variable represents a concrete value and its function is somewhat
similar to a pronoun in natural language. In effects, once we replace variables
with concrete actual values, we have relations between concrete arithmetic expressions.

Variables in Vadalog are more like variables in algebra than like those of imperative programming languages.

Specifically, a good interpretation is the following.

**Variables in Vadalog are like variables in first-order logic**.

For example, consider the following statements:

- "For any man X there exists a father Y"
- "Every father X is a man"

These statements can be true or false depending on how we choose to instantiate X and Y, which means, what specific concrete values we choose. There are quantifiers "for any", "every" (or "for all"), namely universal quantification, and "there exists", namely existential quantification.

It should be noted that a Vadalog variable is **local** to the rule in which it occurs. This means that occurrences of the same variable name in different rules refer to different variables.

Variables cannot occur in facts.

A variable such as X is just a _placeholder_. In order to use it in a computation, we must instantiate it, i.e., replace it with a concrete value. The value is called the _instantiation_ or **binding**.

There are several ways in which a Vadalog variable can be instantiated.

If the variable occurs in an atom in the body of a rule, the variable can then become instantiated to a value derived from the values in the predicate.

In general, a bound variable should be **positively bound**, i.e., it should have a binding occurrence that is not in the scope of a negation.

_Note on syntax_: Variables in vadalog need to be capitalized, and can contain underscores.

## Anonymous Variables

To ignore certain predicates in a rule body, one can use anonymous variables using the underscore symbol. Such as in the following example:

```
t("Text", 1, 2).
t("Text2", 1, 2).
b(X) :- t(X, _, _).
@output("b").
```

## Marked Nulls

A marked null represents an identifier for an unknown value.
Marked nulls are produced as a result of:

1. nulls in the data sources (unless the data source supports marked nulls, all of them are assumed to have different identifiers);
2. existential quantification.

The type of a marked null is always unknown.

The following two examples show possible uses of marked nulls. Many more are indeed
possible and important in ontological reasoning.

**Example 5**

```
employee(1).
employee(2).
manager(Y,X) :- employee(X).
@output("manager").
```

This ontology represents that every employee has a manager. The expected result is: `manager(z1,1). manager(z2,2).` where `z1` and `z2` are marked nulls, representing that there must be a manager for each of the employees, but their identity is unknown.

**Example 6**

```
employee("Jack").
contract("Jack").
employee("Ruth").
contract("Ruth").
employee("Ann").
hired("Ann","Ruth").
manager(Z,X) :- employee(X).
hired(Y,X) :- manager(Y,X),contract(X).
contractSigned(X) :- hired(Y,X),manager(Y,Z).
@output("contractSigned").
```

Example 6 expresses a simple ontology stating that every employee X has a manager Y.
If the manager Y sees that there is a pending contract for the respective employee X,
then he hires the employee. Once a manager Y has hired an employee X, the respective
contract X is signed. If someone has been hired for some reason by an employee who is
not a manager, then the contract will not be signed.
Observe that the name of the manager is unknown throughout the entire processing.
The expected result is: `contractSigned("Jack"). contractSigned("Ruth").`

# Rules

## Linear rules

_Linear rules_ are rules with one single atom in the body. They define facts of the head
predicate, given facts of the single body predicate.

**Example 7**

```
employee(1).
employee(2).
department(Y,X) :- employee(X).
@output("department").
```

For each employee X there exists a department Y.
The expected result is ` department(z1,1). department(z2,2).`

## Facts

The simplest form of linear rule is a **fact**: a ground head-less linear rule.

**Example 8**

```
employee("Jack").
employee("Ruth").
```

## Join rules

_Join rules_ are rules with multiple atoms in the body. They basically define facts of the
head predicate, given facts of the body.

**Example 9**

```
project(Z,X) :- employee(X), department(Y,X).
```

For each employee X in a department Y, there exists a project Z in which he participates.

If the atoms in the body do not have variables in common, the Cartesian product
is assumed.

**Example 10**

```
employee("Jack").
employee("Ruth").
department("science").
department("finance").
canWork(X,Y,Z) :- employee(X), department(Y).
@output("canWork").
```

Any employee X can work in any department Y on some unknown project Z. The expected result is: `canWork("Jack","science",z1). canWork("Jack","finance",z2). canWork("Ruth","science",z3). canWork("Ruth","finance",z4). `

## Constants within rules

Constants can appear in the atoms of the rules.

When they appear in the head, they denote specific constant values to be generated in the head facts.

When they appear in the body, they denote specific filters, or selection criteria,
to be applied to the facts considered in the rule.

**Example 11**

```
employee("Mark").
junior("Mark").
contract(X,"basic",20) :- employee(X),junior(X).
@output("contract").
```

A junior employee will have a "basic" contract, with stipend 20. The expected result is: `contract("Mark","basic",20).`

**Example 12**

```
employee("Mark","junior").
employee("Ruth","senior").
contract(X,"basic",20) :- employee(X,"junior").
contract(X,"advanced",40) :- employee(X,"senior").
@output("contract").
```

Any junior employee X will have a "basic" contract with stipend 20.
Any senior employee X will have an "advanced" contract with stipend 40.
Basically, the constants filter the facts to which the rules apply, in such a way
that the one for basic contracts applies only to Mark, and the one for
advanced contracts applies only to Ruth.
The expected result is: `contract("Mark","basic",20). contract("Ruth","advanced",40).`

# Expressions and operators

An **expression** is inductively defined as follows:

1. a constant is an expression
2. a variable is an expression
3. a proper combination of expressions (by means of operators) is an expression.

They appear in specific parts of a Vadalog program, namely in
**operators**, **conditions** and **assignments**, as we will see.

## Operators

Vadalog supports built-in operations over values of data types. These operations allow to compare values, perform arithmetics, manipulate strings and datetime values.
Operations are supported through symbolic operators, which can be
_prefix_, _infix_ or _functional-style_.

Vadalog supports _single-fact operators_ (simply called operators)
and _multi-facts operators_ (called **aggregation operators**).

## Single-fact operators

| Data type     | Operators                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| all           | `==,>,<,>=,<=,<>`                                                                                        |
| string / list | `substring`, `contains`, `starts_with`, `ends_with`, `concat`, `index_of` (string only), `string_length` |
| integer       | (monadic) `-, *,/,+,-, ( )`                                                                              |
| double        | (monadic) `-, *,/,+,-, ( )`                                                                              |
| Boolean       | `&&` (and), &#124; &#124; (or), `not`, `( )` for associativity                                           |
| set           | &#124; (union), & (intersection), `( )` for associativity, _TBD_                                         |

**Comparison operators**

The comparison operators are `==,>,<,>=,<=,<>` (alternate syntax `!=`).
They can be used to compare literals of any data type and return a Boolean,
depending whether the comparison is satisfied or not. Only values of the same
type can be compared. Marked nulls can be compared only with marked nulls, since
they are the only ones having unknown data type.
Marked nulls are equal when they have the same identifier (i.e.,
the same marked null).

- == : equals to
- \> : greater than
- \< : less than
- \>= : greater or equal
- \<= : less or equal
- \<\> : not equal
- != : not equal

**Arithmetic operators**

The arithmetic operators are _ (multiplication), / (division), + (addition), - (subtraction).
Infix _,/,+,- can be applied to all numeric (integer and double) operands, with an implicit upcast to double if any double is involved.

The operator + (plus) also performs string concatination with an implicit upcast to string if any string is involved.

The operator - (minus) also exists in its monadic version, which simply inverts the signum of a numeric value.

Division by 0 always fails, causing the program to abort.

Operations associate to the left, except that multiplication and division operators have higher precedence than addition and subtraction operators.
Precedence can be altered with parentheses.

**Boolean operators**

The Boolean operators are and (&&), or (||) or not. They can be used to combine
Boolean data types.

**String operators**

The String operators are `substring`, `contains`, `starts_with`, `ends_with`, `concat`, `+`, `index_of` and `string_length`. They can be used to combine values of types String.

A rule with an assignment with a `substring` operator has the general form, and returns the substring, using a zero-based index. `start` and `end` represent integers, respectively the start and the end of substring returned: `q(K1, K2, Kn, J) :- body, J = substring(x, start, end).`

Here is an example for `substring`:

```
a("prometheux").
b("oxford").
q(Y,J) :- a(X), b(Y), J = substring(X,4,10).
@output("q").
```

The expected output is:

```
q("oxford", "metheux").
```

A rule with an assignment using the `starts_with` operator has the general form, and returns true if the string starts with `start_string`: `q(K1, K2, Kn, J) :- body, J = starts_with(string, start_string).`

An example for `starts_with`:

```
a("prometheux").
b("prom").
q(X,Y,J) :- a(X), b(Y), J = starts_with(X,Y).
@output("q").
```

The expected output is: `q("prometheux","prom",#T).`

A rule with an assignment using the `ends_with` operator has the general form, and returns true if the string ends with `end_string`: `q(K1, K2, Kn, J) :- body, J = ends_with(string, end_string).`

An example for `ends_with`:

```
a("prometheux").
b("theux").
q(X,Y,J) :- a(X), b(Y), J = ends_with(X,Y).
@output("q").
```

The expected output is: `q("prometheux","theux",#T).`

A rule with an assignment using the `concat` operator has the general form, and returns the concatenation `string`+`concat_string`:
`q(K1, K2, Kn, J) :- body, J = concat(string, concat_string).`

An example for `concat`:

```
a("prometheux").
b("engine").
q(X,Y,J) :- a(X), b(Y), J = concat(X,Y).
@output("q").
```

The expected output is: `q("prometheux","engine","prometheuxengine").`

A rule with an assignment using the `string_length` operator has the general form, and returns an integer representing the length of the string: `q(K1, K2, Kn, J) :- body, J = string_length(string).`

An example for `string_length`:

```
a("prometheux").
q(X,J) :- a(X), J=string_length(X).
@output("q").
```

The expected output is: `q("prometheux",10).`

**Math operators**

It is implemented in the library, `math`. The supported mathematical operators:

- `mod`: computes a modulo between two parameters provided, returning a single integer value.
- `sqrt(X)`: computes square root of `X`, returning a single double value.
- `abs(X)`: computes the absolute value of `X`.
- `min(X1, ..., Xn)`: computes the minimum value among `X1, ..., Xn`. These parameters must be of the same type.
- `max(X1, ..., Xn)`: computes the maximum value among `X1, ..., Xn`. These parameters must be of the same type.
- `log10(X)`: computes the lograrithm of `X` to base 10.
- `log(X)`: computes the natural logarithm of `X`.
- `pow(X,Y)`: computes `X` to the power of `Y`. Returns a value of type double.
- `exp(X)`: computes `e^X`.
- `round(X)`: returns the closest integer to `X`.
- `ceil(X)`: computes the smallest integer `Y` that is equal to or greater than `X`.
- `floor(X)`: computes the largest integer `Y` that is equal to or smaller than `X`.
- `sin(X), cos(X), tan(X)`: the usual trigonometric functions.
- `PI(X)`: gives the number Pi.
- `E(X)`: gives the e number.
- `rand(X)`: produces a random double number greater than or equal to `0.0` and less than `1.0`.

**Hash operators**

The `hashCode` library provides support for computing various hash functions. Currently supported are the following cryptographic hash functions:

- `hash(X1, ..., Xn)`
- `md5(X1, ..., Xn)`
- `sha1(X1, ..., Xn)`

**List operators**

The List operators are `contains`, `concat`.

The expected output is: `b([1,2]).`

The Boolean list operator `contains(List, Element)` returns true if `List` `Element`:

An example for `contains`:

```
a([0, 1, 2, 3, 4, 5]).
b(3).
b(2).
c(Y,J) :- a(X), b(Y), J = contains(X,Y).
@output("c").
```

The expected output is:

`c(3, #T). c(2, #F).`

**Collections**

The library `collections` implements functions for basic manipulation of collections, such as lists and sets..

- `size(X)`: returns the size of the collection `X`.
- `contains(X, Y)`: returns `true` if `Y` is in `X`, `false` otherwise.
- `containsAll(X, Y)`: returns `true` if collection X contains all the elements of collection Y, `false` otherwise.
- `sort(X)`: returns a copy of the list `X` with elements sorted in ascending order.
- `add(X, Y)`: returns a copy of the collection `X` with the element `Y` added to the collection. In case 'X' is a list, 'Y' is added to the end of 'X'.
- `union(X, Y)`: returns the union of collections `X` and `Y`. In case both `X` and `Y` are lists, `Y` is appended to `X`.
- `intersection(X, Y)`: returns a copy of the collection `X` which contains elements from the collection `Y`.
- `difference(X, Y)`: returns a copy of the collection `X` which does not contain elements from the collection `Y`.

## Monotonic Aggregates

Monotonic aggregations are functions for incremental and recursion-friendly
computation of aggregate values.

These functions are allowed in recursive rules. The currently supported functions include:

- `msum(X, [K1, ..., Kn], [C1, ..., Cm])` for the incremental computation of sums
- `mprod(X, [K1, ..., Kn], [C1, ..., Cm])` for the incremental computation of products
- `mcount(K1, K2, ...)` for the incremental computation of counts
- `mmin(X, K1, K2, ...)` for the incremental computation of minimal
- `mmax(X, K1, K2, ...)` for the incremental computation of maximal

Upon invocation, all functions return the currently accumulated value for the respective aggregate. All functions,
except `count`, take as first argument the value to be used in the incremental computation of the
aggregation. For `sum` and `prod`, the second argument is the list of group-by variables, and the third argument
is the list of contributors.

Finally, all functions besides `sum` and `prod` take a list of values, called keys, to be used as a group identifier
(i.e. they play the role of group by variables in standard SQL).

As an example consider the following program:

```
a("one", 3, "a", 10).
a("one", 6, "c", 30).
a("one", 1, "b", 20).
a("one", 2, "c", 30).

a("two", 5, "f", 60).
a("two", 3, "e", 50).
a("two", 6, "g", 70).
a("two", 2, "d", 40).
a("two", 3, "d", 40).

ssum(X, Sum) :- a(X, Y, Z, U), Sum = msum(Y).
pprod(X, Sum) :- a(X, Y, Z, U), Sum = mprod(Y).
pmin(X, Sum) :- a(X, Y, Z, U), Sum = mmin(Y).
pmax(X, Sum) :- a(X, Y, Z, U), Sum = mmax(Y).
ccount(X, Sum) :- a(X, Y, Z, U), Sum = mcount(X).
ccount_other(X, Sum) :- a(X, Y, Z, U), Sum = mcount(X).

@output("ssum").
@output("pprod").
@output("pmin").
@output("pmax").
@output("ccount").
@output("ccount_other").
```

After execution, the relation `ssum` could contain the following tuples:

```
ssum("one", 12.0)

ssum("two", 19.0)
```

A rule with an assignment using an aggregation operator has the general form: `q(K1, K2, Kn, J) :- body, J = maggr(x,<C1,...,Cm>)` where `K1, . . . , Kn` are zero or more group by arguments, `body` is the rule body, `maggr` is a placeholder for an aggregation function (`mmin`, `mmax`, `msum`, `mprod`), `C1,...,Cm` are zero or more variables of the body (with Ci ≠ Kj, 1 ≤ i ≤ m, 1 ≤ j ≤ n), which we call contributor arguments, `x` is a Constant, a body variable or an expression containing only single-fact operators.

For each distinct n-tuple of `K1 , . . . , Kn`, a monotonic decreasing (increasing) aggregate function `maggr` maps an input multi-set of vectors G, each of the form gi = (C1,...,Cm,xi) into a set D of values, such that xi is in D if xi is less (greater) than the previously observed value for the sub-vector of contributors (C1, . . . , Cm). Such aggregation functions are monotonic w.r.t. set containment and can be used in Vadalog together with recursive rules to calculate aggregates without resorting to stratification (separation of the program into ordered levels on the basis of the dependencies between rules).

In the execution of a program, for each aggregation, the aggregation memorizes
for each vector (C1 , . . . , Cm ) the current minimum (or maximum) value of x. Then, for each activation of a rule with the monotonic aggregation at hand, an updated value for the group selected by K1,...,Kn is calculated by combining all the values in D for the various vectors of contributors. The kind of combination specifically depends on the semantics of `maggr` (e.g. minimum, maximum, sum, product, count) and, provided the monotonicity of the aggregates, it is easily calculated by memorizing a current aggregate, which is updated with the new contributions brought by the sequence of rule activations.

The following assumption is made:

- if a position _pos_ in a head for predicate _p_ is calculated with an aggregate function, whenever a head for _p_ appears in any other rule, _pos_ must be existentially quantified and calculated with the same aggregate function.

This assumption guarantees the homogeneity of the facts with existentially aggregated functions.

Let us start with a basic example.

**Example 13**

```
s(1.0,"a").
s(2.0,"a").
s(3.0,"a").
s(4.0,"b").
s(3.0,"b").

f(J,Y) :- s(X,Y), J = msum(X).
@output("f").
```

The expected output is:

`f(6,"a"). f(7,"b").`

For each activation of the aggregation operator `msum`, we calculate the
current aggregate, for each group, denoted by variable Y in f.
So for the first group, "a", we have 1, and than 3=1+2. For the second
group, "b", we have 4 and then 7=4+3.

This example gives the flavour of how monotonic aggregations work.
For each activation of the rule, the current result is produced. Since the
aggregations are monotonic, we are certain that the maximum (minimum) value
for each group is deterministically the correct aggregate.
On the other hand, the intermediate values
for partial aggregates are _non-deterministic_, since they depend on the
specific execution order.

Let us now consider contributors through the following example.

**Example 14**

```
s(0.1,2,"a").
s(0.2,2,"a").
s(0.5,3,"a").
s(0.6,4,"b").
s(0.5,5,"b").

f(J,Z) :- s(X,Y,Z), J = mprod(X,<Y>).
@output("f").
```

Here we want to calculate the monotonic product aggregation of the values for
X, grouped by Z. Besides, we specify that Y denotes the specific contributor to the product.
This means that in the aggregation, we multiply X for distinct values of Y. Whenever
there are two facts within the same group that refer to the same contributor, then
we consider only the one with the smallest contribution on X. Observe, that if the
aggregation operator were monotonically increasing, we would consider the fact with the greatest contribution.

Therefore, the expected result is: `f(0.05,"a"). f(0.3,"b").`

The first activation of the rule produces 0.1. Then, for the second one, since both
s(0.1,2,"a") and s(0.2,2,"a") contribute to the group "a" for the contributor 2, then
we consider only the first one, as it gives the smaller contribution. Hence the partial
result is still 0.1. Finally we multiply it by 0.5 and get 0.05, since 0.5 comes for a
distinct contributor, 3.
For group "b", the situation is simpler, as the two factors are related to different contributors.

**Example 15**

```
edge(1,2).
edge(3,2).
edge(5,2).
edge(3,1).
edge(2,5).
indegree(Y,J) :- edge(X,Y),J=msum(1,<X>).
found(X) :- indegree(X,J),J>2.
@output("found").

```

The expected result is: `found(2).`

In this example, all the intermediate results have been simply discarded by introducing
the threshold, technically a condition, J>2.

In addition, Vadalog Parallel provides an annotation mechanism that allows to introduce special behaviors, pre-processing and post-processing features. A post-processing annotation can be used to filter only the maximum (or minimum) values for each group as follows (see the section on [Post-processing](#post-processing) for more details).

**Example 16**

```
s(1.0,"a").
s(2.0,"a").
s(3.0,"a").
s(4.0,"b").
s(3.0,"b").

f(J,Y) :- s(X,Y), J = msum(X).
@output("f").
@post("f","max(1)").
```

The aggregates `min` and `max` have the expected semantics with the difference that they produce no intermediate results.
Consider for example the following program.

```
b(1,2).
b(1,3).
b(2,5).
b(2,7).
h(X,Z) :- b(X,Y), Z = max(Y), X > 0.

@output("h").
```

The output (listed bellow) does not include the intermediate results: `h(1, 3). h(2, 7).`

These operations can also be used to compute the rest of the aggregate operations without intermediate results.
For example, the following program computes the sum of positive values.

```
b(1,2).
b(1,3).

b(2,5).
b(2,7).

b_msum(X,Z):- b(X, Y), Z = msum(Y).
b_sum(X,Z) :- b_msum(X, Y), Z = mmax(Y).

@output("b_sum").
```

The expected result is `b_sum(1, 5). b_sum(2, 12).`

The aggregate `mcount` has the expected semantics and does not produce any intermediate results.
Consider for example the following program.

```
b(1,2).
b(1,3).
b(2,5).
b(2,7).
b(2,9).
h(X,Z) :- b(X,Y), Z = mcount(Y), X > 0.

@output("h").
```

The expected output is `h(1, 2). h(2, 3).`

## Transitive Closure

Find the pairwise connectivities of all nodes in a graph

```
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
path
X	Z
4	5
1	2
1	4
1	6
2	3
4	3
6	3
7	1
3	7
6	7
5	7
1	5
2	7
7	4
1	3
1	7
7	6
6	1
4	7
3	1
7	2
5	1
2	1
3	6
3	4
4	1
7	7
6	4
5	6
5	4
1	1
7	5
7	3
6	6
6	2
3	2
5	2
3	3
4	4
6	5
5	3
2	4
2	2
3	5
4	6
4	2
2	6
5	5
2	5
```

### Monotonic Aggregations in Financial Applications

## Company control

Company control is a staple of the analysis of ownership structure;
it concerns decision power, i.e., when a subject can direct the decisions of
another company via the control of the majority of the shares.

This scenario consists in determining who takes decisions in a company network, that is, who controls the majority of votes for each company. A company X controls a company Y, if: (i) X directly owns more than 50% of Y; or, (ii) X controls a set of companies that jointly, and possibly together with 𝑐1 itself, own more than 50% of Y [20]. This problem can be modeled via the following set of recursive Vadalog rules.

```
% input company graph, described as ownerships edges
% the company 1 own 0.9% of shares of 2
own(1,2,0.9).
% the company 2 own 1.0% of shares of 3
own(2,3,1.0).
own(3,2,0.1).
own(3,4,0.9).
own(4,5,1.0).
own(5,1,0.1).
own(1,6,0.9).
own(6,5,1.0).
own(5,10,0.9).
own(10,20,1.0).
own(20,1,0.5).
own(1,10,0.9).
own(19,5,1.0).
own(10,19,0.5).

% base case: if a company X owns Y with shares Q then there is direct a controlled_share relationship from X to Y with share Q %
controlled_shares(X,Y,Y,Q) :- own(X,Y,Q), X<>Y.

% recursive case: if a company X controls Y with shares K
and the company Y owns Z with share Q, then there there is a indirect controlled_share relationship from X to Z with share Q%
controlled_shares(X,Z,Y,Q) :- control(X,Z,K), own(Z,Y,Q), X<>Z, Z<>Y, X<>Y.

% if X has controlled_shares of Y, passing per Z with shares Q, then the total controlled share are computed with a monotonic aggreagation msum, that groups by X and Z and aggregates the sum of Q%
total_controlled_shares(X,Y,J) :- controlled_shares(X,Z,Y,Q), J=msum(Q).

% if the total controlled shares Q of X over Y is greater than 0.5, then X control Y with shares Q.
control(X,Y,Q) :- total_controlled_shares(X,Y,Q), Q>0.5.
% if group by the company X and Y over the max value of Q then the maximum control is M %
controlMax(X,Y,M) :- control(X,Y,Q), M = mmax(Q).

@output("controlMax").
```

After execution, the relation `controlMax` contains the following tuples:

```
controlMax
X	Y	M
1	2	1
1	3	1
1	4	0.9
1	5	2
1	6	0.9
1	10	1.8
1	20	1
2	1	0.6
2	3	1
2	4	0.9
2	5	2
2	6	0.9
2	10	1.8
2	20	1
3	1	0.6
3	2	1
3	4	0.9
3	5	2
3	6	0.9
3	10	1.8
3	20	1
4	1	0.6
4	2	1
4	3	1
4	5	2
4	6	0.9
4	10	1.8
4	20	1
5	1	0.6
5	2	1
5	3	1
5	4	0.9
5	6	0.9
5	10	1.8
5	20	1
6	1	0.6
6	2	1
6	3	1
6	4	0.9
6	5	2
6	10	1.8
6	20	1
10	20	1
19	1	0.6
19	2	1
19	3	1
19	4	0.9
19	5	3
19	6	0.9
19	10	1.8
19	20	1
```

## Close Link

This scenario consists in determining whether there exists a (direct
or indirect) link between two companies, based on a high overlap of shares. Formally, two companies 𝑐1 and 𝑐2 are close links if: (i) X (resp. Y) owns directly or indirectly, through one
or more other companies, 20% or more of the share of Y (resp. X) Determining whether two companies are closely-linked is extremely important for banking
supervision since a company cannot act as a guarantor for loans to another company if they
share such a relationship. This problem can be modeled via the following set of recursive
Vadalog rules

```
% input company graph, described as ownerships edges
% the company A own 0.2% of shares of the comapany B
own("A","B",0.2).
% the company B own 0.8% of shares of the comapany A
own("B","A",0.8).
own("B","C",0.2).
own("C","D",0.6).
own("D","A",0.9).
own("A","C",0.2).

% if there the company X owns a percentage W of shares of Y and we add in a set the visited node X and the visited node Y, then there is a closeLinkPaths of X over Y with shares W and we bring the list of visited nodes P. We bring in the head the list and we will use it in recursive rule %
closeLinkPaths(X,Y,W,P) :- own(X,Y,W), P={}|X|Y, X<>Y.

% if there is a closeLinkPath from X to Y with shares W1 with a set of visited nodes P1, and the node Z is not in the list of the visited nodes, the node Z is added in the set of visited nodes, then there is a closeLinkPaths from X,Z with visited nodes P %
closeLinkPaths(X,Z,J,P) :- closeLinkPaths(X,Y,W1,P1), own(Y,Z,W2), J=W1*W2, P=P1|Z, Z !in P1.

% if there is a closeLinkPaths from the company X to the company Y with shares W and the set of visited nodes P, then there is a close_link_sum by grouping by X and Y with totale share J, by aggregating the sum of W %
close_link_sum(X,Y,J)  :- closeLinkPaths(X,Y,W,P), J = msum(W).

% if there is a close_link_sum of X over Y with shares W, and the shares is greater than 0.2, then the companies X and Y are in close link with shares W %
close_link(X,Y,W) :- close_link_sum(X,Y,W), W >= 0.2.
@output("close_link").
```

After execution, the relation `close_link` contains the following tuples:

```
close_link
X	Y	W
A	C	0.24
B	D	0.216
D	C	0.216
B	A	0.908
C	D	0.6
A	B	0.2
B	C	0.36
C	A	0.54
D	A	0.9
```

## Conditions

Rules can be enriched with conditions in order to constrain specific values for variables of the body.
Syntactically, the conditions follow the body of the rule.
A condition is the comparison (`>,<,=,>=,<=,<>`) of a variable (the LHS of the comparison)
of the body and an **expression** (the RHS of the comparison).

Notice that although the comparison symbols used in conditions are partially overlapped with the symbols for comparison operators (partially, since we have `=` for equality instead of `==`), they have different semantics.
While comparison operators calculate Boolean results, comparison symbols in conditions only specify a filter.

Each rule can have multiple comma-separated conditions.

**Example 17**

```
contract("Mark",14).
contract("Jeff",22).
rich(X) :- contract(X,Y),Y>=20.
@output("rich").
```

In the example we individuate the contracts for Y>=20 and classify the respective
employee as rich. The expected result is: `rich("Jeff").`

**Example 18**

```
balanceItem(1,7,2,5).
balanceItem(2,2,2,7).
error(E,I) :- balanceItem(I,X,Y,Z),X<>Y+Z.
@output("error").
```

In the example we individuate the balance items for which X is different from the
sum of Y and Z and report an error E for the identifier I of such an item.
The expected result is: `error(z_,2).`

**Example 19**

```
player(1,"Chelsea").
age(1,24).
player(2,"Bayern").
team("Chelsea").
age(2,25).
player(2,"Bayern").
team("Chelsea").
age(2,25).
player(3,"Chelsea").
age(3,18).
team("Chelsea").
team("Bayern").
seniorEnglish(X) :- player(X,Y), team(Y), age(X,A), Y="Chelsea", A>20.
@output("seniorEnglish").
```

It selects the senior English players. They are those who play with
Chelsea with age greater than 20. The expected result is: `seniorEnglish(1).`

## Assignment

Rules can be enriched with assignments in order to generate specific values for existentially
quantified variables of the head. Syntactically, the assignments follow the body of the rule. An assignment is the equation (=) of a variable (the LHS of the equation) of the body and an expression (the RHS of the equation).

Observe that although assignments and equality conditions are denoted by the same symbol (=),
assignments and conditions can be unambiguously distinguished, since the LHS of the equation appears only in the head.

Each rule can have multiple comma-separated assignments.

**Example 20**

```
balanceItem("loans",23.0).
balanceItem("deposits",20.0).
operations(Q,Z,A) :- balanceItem(I1,X),balanceItem(I2,Y),
					  I1="loans",I2="deposits",Z=X+Y,A=(X+Y)/2.
@output("operations").
```

Example 20 generates a fact for operations, summing two balance items, one for loans and one for
deposits. Observe that `I1="loans"` and `I2="deposits"` are conditions to select
the balanceItems (as I1 and I2 appear in the body), whereas `Z=X+Y` and `A=(X+Y)/2` are assignments (as Z and A do not appear in the body).

The expected result is: `operations(z_,43,21.5).`

## Recursion

We say that a Vadalog program or ontology is **recursive** if the
dependency graph implied by the rules is cyclical. The simplest
form of recursion is that in which the head of a rule also appears in the body
(_self-recursive rules_).

Recursion is particularly powerful as it allows for inference based
on previously inferred results.

In self-recursive rules, in case of bodies with two atoms, we distinguish between:

1. _left recursion_, where the recursive atom is the left-most;
2. _right recursion_, where the recursive atom is the right-most.

Some examples follow.

**Example 22**

```
edge(1,2).
edge(2,3).
edge(1,4).
edge(4,5).
path(X,Y) :- edge(X,Y).
path(X,Z) :- path(Y,Z), edge(X,Y).
@output("path").
```

The expected results are:

`path(1,3). path(1,2). path(1,5). path(2,3). path(1,4). path(4,5).`

The examples above show reachability in graphs with left recursion, in the extended version of the manual further examples.

## Negation

Negation is a prefix modifier that negates the truth value for an atom.
In logic terms, we say that a negated formula holds whenever it is false, for example
`not employee(X)` holds if X is not an employee. Negation has higher precedence
than conjunction, so the single atoms are negated and not the entire body (or parts thereof).

The following assumptions are made:

1. Every variable that occurs in the head must have a binding in a non-negated atom.
2. Every binding of a variable that occurs only in a negation is not exported outside of the negation.

It is clear that assumption 2 implies assumption 1: as the bindings captured within the negation cannot be used outside the negation itself, they cannot be used to generate new facts in the head. However 2 is more specific, since it even forbids joins in the body
based on negatively bound variables.

Whereas assumption 1 is enforced in the Engine and its violation causes a runtime error, condition 2 is not enforced and negatively bound joins can be used (albeit discouraged), being aware of the theoretical and practical implications.

**Example 23**

```
employee("Mark").
employee("Ruth").
director("Jane").
hired("Ruth").
contractor("Mark").
project(1,"Mark").
project(2,"Ruth").
project(3,"Jane").

safeProjects(X,P) :- project(X,P), not contractor(P).

@output("safeProjects").
```

The expected result is:

`safeProjects(2,"Ruth"). safeProjects(3,"Jane").`

Here we select the safe projects, which are those run by a person who is not
a contractor. Since a person can have various company attributes (`employee`, `hired`, etc.),
even at the same time, here we simply check that he/she is not a contractor.

**Example 24**

```
s(1,2).
s(2,3).
s(3,5).
s(4,6).
b(6,2).
b(4,2).
b(2,2).
c(2).

f(X,Y) :- s(X,Y), not b(Y,Z).
f(Y,X) :- f(X,Y), not b(X,Z).

@output("f").

```

The expected result is:

`f(5,3). f(2,3). f(3,5).`

Here we combine recursion and negation and recursively generate f, by negating b.

# Annotations

Annotations are special facts that allow to inject specific behaviors into Vadalog programs.
They can be _stand-alone_, _rule level_ or _fact level_.

Stand-alone annotations adopt the following syntax: `@annotationName(p1, ..., pn).`

Rule-level annotations adopt the following syntax: `@annotationName(p1, ..., pn) a(X) :- b(X,Y),c(Y).`

Multiple rule-level annotations are also supported: `@annotationName1(p1, ..., pm) @annotationName2(p1, ..., pn) a(X) :- b(X,Y),c(Y).`

The fact-level annotations adopt the following syntax: `@annotationName(p1, ..., pn) myFact(1,2,"a"). `

Multiple fact-level annotations are also supported: `@annotationName(p1, ..., pn) @annotationName2(p1, ..., pm) myFact(1,2,"a").`

They are all prefixed and whitespace-separated (comma "," denotes conjunction and should not be used here).

In all the syntaxes above, `annotationName` indicates the specific annotation and each of them accepts a specific list of parameters. In the following sections we present the supported annotations.

## Input

It specifies that the facts for an atom of the program are imported from an external data source, for example a relational database.

The syntax is the following: `@input("atomName").`

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

**Example 32**

```
@input("m").
@input("q").
@output("m").
@bind("m","postgres","doctors_source","Medprescriptions").
@bind("q","sqlite","doctors_source","Medprescriptions").
m(X) :- b(X),q(X).
```

This example reads the facts for `m` from a Postgres data source, specifically from
schema `doctors_source` and table `Metprescriptions`, reads facts for `q` from a SQLite (in SQLite the schema is ignored)
data source and performs a join.

### bind multiple sources to an input predicate

You can bind multiple external sources (csv, postgres, sqlite, neo4j, ...) to a single input predicate. In this example we have a graph partitioned in a csv file and a postgres database and we bind them to the predicate `edge`. As a result the facts from the two sources are merged into `edge`.

```
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

The syntax is the following: `@mapping("atomName",positionInAtom,"columnName","columnType").`

where `atomName` is the atom we want to map, `positionInAtom` is an integer (from 0)
denoting the position of the atom that we want to map; `columnName` is the name of the column in the source (or equivalent data structure), `columnType` is an indication of the type in the source. The following types can be specified: _string_, _int_, _double_, _boolean_ and _date_.

**Example 33**

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

In this example, we map the columns of the `Medprescriptions` table.

Observe that _mappings can be omitted_ for both `@input` and `@output` atoms. In such case they are automatically inferred from the source (target); the result can be however unsatisfactory depending on the sources, since some of them do not support positional reference to the attributes.

### @qbind

`@qbind` binds an input atom to a source, generating the facts for the atom as the result of a query executed on the source.

The syntax is the following:

```
@qbind("atomName","data source","outermost container","query").
```

where `atomName` is the atom we want to bind, `data source` is the name of a source defined in the Vadalog configuration, `outermost container` is a container in the data source (e.g., a schema in a relational database), `query` is a query in the language supported by the source (e.g., SQL for relational databases).

**Example 34**

```
@qbind("t","postgres","vada","select * from ""TestTable"" where id between 1 and 2").
```

Here we bind atom `t` to the data source postgres, selecting a specific content from the table `TestTable`.

You can also use parametric `@qbind`, for example:

**Example 35**

```
@qbind("t","postgres","vada","select * from ""TestTable"" where id = ${1}").
```

where `${1}` is a parameter, which will have the values of the first input field `t`.
Parametric `@qbind` should be used in joins with other atoms.

You can also use multiple parameters within a parametric `@qbind`:

**Example 36**

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
@post("atomName", "orderby(p1,..., pn)").
```

where `atomName` is the atom to be sorted, `p1, ..., pn` are integers denoting a valid position in atomName (starting from 1). The sorting is orderly applied on the various positions. A position can be prefixed with the minus sign (-) to denote descending sorting.

For the various data types the usual order relations are assumed (to be extended).

**Example 39**

```
t(1,"b",5).
t(1,"a",1).
t(1,"c",1).
p(X,Y,Z) :- t(X,Y,Z).
@output("p").
@post("p","orderby(3,-2)").
```

We order by the third position (ascending) and, for the same value of the third position, by descending values of the second position.

The expected result is: `p(1,"c",1). p(1,"a",1). p(1,"b",5).`

### Min

It calculates the minimum value for one ore more positions on an atom, grouping by the other positions.

The syntax is the following:

```
@post("atomName","min(p1, ..., pn)").
```

where `atomName` is the atom at hand, `p1, ..., pn` are integers denoting a valid position in atomName (starting from 1).

**Example 40**

```
t(1,"b",5).
t(1,"b",1).
t(1,"c",1).
p(X,Y,Z) :- t(X,Y,Z).
@output("p").
@post("p","min(3)").
```

The expected result is:

`p(1,"b",1). p(1,"c",1).`

Note that the min value is computed according to the lexicographic order over tuples obtained by projecting on the positions in the post-processing annotation.

**Example**

```
t(1,"b",1).
t(2,"c",1).
t(1,"a",1).
q(X,Y,Z) :- t(X,Y,Z).
@output("q").
@post("q","min(1,2)").
```

Then the expected result is `p(1,"a",1).` Indeed, all the three tuples `(1,"b")`, `(2,"c")` and `(1,"a")` fall within one group, and `(1,"a")` is a minimal tuple among them according to the lexicographic order.

### Max

It calculates the maximum value for one ore more positions on an atom, grouping by the other positions.

The syntax is the following:

```
@post("atomName","max(p1, ..., pn)").
```

where `atomName` is the atom at hand, `p1, ..., pn` are integers denoting a valid position in atomName (starting from 1).

**Example 41**

```
t(1,"b",5).
t(1,"b",1).
t(1,"c",1).
p(X,Y,Z) :- t(X,Y,Z).
@output("p").
@post("p","max(3)").
```

The expected result is:

`p(1,"b",5). p(1,"c",1).`

Note that the max value is computed according to the lexicographic order over tuples obtained by projecting on the positions in the post-processing annotation.

**Example**

```
t(2,"b",1).
t(1,"c",1).
t(2,"a",1).
q(X,Y,Z) :- t(X,Y,Z).
@output("q").
@post("q","max(2,1)").
```

Then the expected result is `p(1,"c",1).` Indeed, all the three tuples `("b",2)`, `("c",1)` and `("a",2)` fall within one group, and `("c",1)` is a maximal tuple among them according to the lexicographic order.

### Argmin

It groups the facts of an atom according to certain positions and, for each group, it returns
only the facts that minimise a specific position.

The syntax is the following:

```
@post("atomName", "argmin(p, <p1,..., pn>)").
```

where `atomName` is the atom at hand, p is the position to minimise (from 1) and `p1, ..., pn` are integers denoting the positions that individuate a specific group.

**Example 42**

```
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

The expected result is: `g(1,3,"a",3). g(2,6,"b",7).`

### Argmax

It groups the facts of an atom according to certain positions and, for each group, it returns
only the facts that maximise a specific position.

The syntax is the following:

```
@post("atomName", "argmax(p, <p1,..., pn>)").
```

where `atomName` is the atom at hand, `p` is the position to maximise (from 1) and `p1, ..., pn` are integers denoting the positions that individuate a specific group.

**Example 43**

```
f(1,3,"a", 3).
f(4,3,"a", 5).
f(2,6,"b", 7).
f(2,6,"b", 8).
f(3,6,"b", 9).
@output("g").
@post("g","argmax(4,<2,3>)").
@post("g","orderby(1)").

g(X,Y,Z,K) :- f(X,Y,Z,K).
```

The expected result is: ` g(3,6,"b",9). g(4,3,"a",5).`

### Unique

In reasoning with Vadalog Parallel, there are particular situations where duplicate facts for a specific atom may occur in the output. In general, there is no guarantee that output atoms are duplicate-free.

In case such guarantee is required, the unique post-processing annotation can be used. The syntax follows:

```
@post("atomName", "unique").
```

where `atomName` is the name of the atom at hand.

where `atomName` is the name of the atom at hand.

### Limit

Sometimes it is useful to limit an output relation to a fixed number of tuples.
One can achieve this in two different way with the use of the post-processing
annotations `limit` as shown below.

```
@post("atomName", "limit(N)").
```

# Data sources

## Relational database source

Vadalog Parallel can read and write to the following relational databases: PostgreSQL and SQLite. Please refer to the [configuration](#configuring-prometheuxengine) section for connecting to your database. Then, refer to the [Bind and Mappings](#bind-mappings-and-qbind) section for instructions on how to read, update and delete data from these data sources.

## CSV data source

Vadalog supports CSV files as data source, both for reading and writing.

The default CSV binding (`"csv"`) is thus suitable for processing big CSV files.
It does not make a guess about the input schema. Therefore, if no schema ([@mapping](#mapping)) is provided,
all fields are treated as strings.
Values `\N` are treated as `null` values and interpreted as [Marked Nulls](#marked-nulls) while reading the CSV file.

### Configuration (Bind Command)

The bind command allows for the configuration of reading and writing cvs files. The syntax is as follows:

```
@bind("relation", "csv option_1 = 'value_1', option_2 = 'value_2', ... , option_n = 'value_n'", "filepath", "filename").
```

The options that are available are

- `useHeaders`: Values can be `true` or `false`, depending on whether a header is available/output.
- `delimiter`: Specifies the character that is used to seperate single entries
- `recordSeparator`: Specifies how the record are seperated
- `quoteMode`: Defines quoting behavior. Possible values are:
  - `ALL`: Quotes all fields.
  - `MINIMAL`: Quotes fields which contain special characters such as a the field delimiter, quote character or any of the characters in the line separator string.
  - `NON_NUMERIC`: Quotes all non-numeric fields.
  - `NONE`: Never quotes fields.
- `nullString`: Value can be any string, which replaces null values in the csv file.
- `selectedColumns`: Value is a list of the form `[c1;...;cn]` to select only the columns `c1,...,cn` from the csv file. Each value in the list is either a column name (enclosed with single quotes 'column name') which is present in the csv's header, or is an integer starting from 0 denoting the column index. It is also possible to specify ranges; e.g. `selectedColumns=[0:4]` reads only the five columns `0,1,2,3,4`. It is allowed to mix the values in the list, e.g. `selectedColumns=[0:3; 'Column_5']` would select columns `0,1,2,3` and the column with the name `Column_5`. Note that in order to select columns by name, a header line in the csv must be present.

When specifying a configuaration, any subset of these options can be set at the same time.
Each value has be sourounded by single quotation marks `'value'`.
An example for a csv bind command with configuration would be the following:

```
@bind("relation", "csv useHeaders=false, delimiter='\t', recordSeparator='\n'", "filepath", "filename").
```

### Examples

In the examples below we use a sample CSV file with the following content: `a,b,c\nd,e,f`

In this example, we read the CSV file with a mapping:

**Example 48**

```
au(X,Y,Z) :- ou(X,Y,Z).
@input("ou").
@bind("ou", "csv useHeaders=true", "/path_to_csv/folder", "csv_name.csv").
@mapping("ou", 0, "var1", "string").
@mapping("ou", 1, "var2", "string").
@mapping("ou", 2, "var3", "string").

@output("au").
```

In this example, we read a CSV file without mapping annotations:

**Example 49**

```
au(X,Y,Z) :- ou(X,Y,Z).
@input("ou").
@bind("ou", "csv", "/path_to_csv/folder", "csv_name.csv").

@output("au").
```

**Example for `selectedColumns`**

The following reads only the the four columns with indices `0,1,2,4` from the CSV file, excluding the column `3`.

```
au(W, X,Y,Z) :- ou(W, X,Y,Z).
@input("ou").
@bind("ou", "csv selectedColumns=[0:2; 4]", "/path_to_csv/folder", "csv_name.csv").

@output("au").
```

To store results into another CSV file, you must use Evaluate and bind the entry point.
In this example, we read a CSV file without mapping annotations and write the output into another CSV file:

**Example 50**

```
au(X,Y,Z) :- ou(X,Y,Z).
@input("ou").
@bind("ou", "csv", "/path_to_csv/folder", "csv_name.csv").

@output("au").
@bind("au","csv","/Users/.../Desktop","result.csv").
```

Furthermore, Vadalog support the CSV file data source via http GET. in Example 47 we read a CSV file via http. In Example 49, we write the result into a local CSV file (Evaluate and store entry point).

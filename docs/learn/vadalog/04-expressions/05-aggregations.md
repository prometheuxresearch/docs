---
slug: /learn/vadalog/expressions/aggregations
---

# Aggregations

Monotonic aggregations are functions for incremental and recursion-friendly
computation of aggregate values. They mainstain state outside of the program, allowing you to perform calculations across recursive steps.

The functions are:

- `msum(X, [K1, …, Kn])` for the incremental computation of sums
- `mprod(X, [K1, …, Kn])` for the incremental computation of
  products
- `mcount([K1])` for the incremental computation of counts
- `mmin(X, [K1, …, Kn)` for the incremental computation of minimal
- `mmax(X, [K1, …, Kn])` for the incremental computation of maximal
- `munion(X, [K1, …, Kn])` for the incremental union of sets
- `mavg(X)` for the incremental computation of averages

Upon invocation, all functions return the currently accumulated value for the
respective aggregate. All functions, except `mcount`, take as first argument the
value to be used in the incremental computation of the aggregation.

**IMPORTANT**: Group-by behavior is achieved by having the same variables appear in both the rule head and body. The aggregation functions themselves do NOT take group-by variables as parameters.

**Group-by Logic**: 
- Variables that appear in both the head and body create implicit grouping
- The aggregation function takes only the expression to aggregate
- Example: `dept_avg(Dept, Avg) :- employee(_, Dept, Salary), Avg = mavg(Salary).`
- Here, `Dept` creates the grouping because it appears in both head and body

Some aggregate functions cannot be used inside a recursive rule because the
value they return may change in a non-monotonic way when new facts arrive
(e.g., the "winner" of an election can be replaced by a later vote).
These functions are fully supported in non-recursive queries or as a
post-processing step after the recursive evaluation has converged.

These functions are:
- `maxcount()` selects, for each group identified by the keys, the row that occurs most often and the corresponding count.

The framework currently provides one such function:

As an example consider the following program:

```prolog showLineNumbers {12-17}
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
aavg(X, AVG) :- a(X, Y, Z, U), AVG = mavg(Y).

@output("ssum").
@output("pprod").
@output("pmin").
@output("pmax").
@output("ccount").
@output("ccount_other").
@output("aavg").
```

After execution, the relation `ssum` contains the following tuples:

```prolog
ssum("one", 12.0)
ssum("two", 19.0)
```

The relation `pprod` contains the following tuples:

```prolog
pprod("one", 360.0)
pprod("two", 12600.0)
```

The relation `pmin` contains the following tuples:

```prolog
pmin("one", 1.0)
pmin("two", 2.0)
```

The relation `pmax` contains the following tuples:

```prolog
pmax("one", 6.0)
pmax("two", 7.0)
```

The relation `ccount` contains the following tuples:

```prolog
ccount("one", 4)
ccount("two", 5)
```

The relation `ccount_other` contains the following tuples:

```prolog
ccount_other("one", 4)
ccount_other("two", 5)
```

The relation `aavg` contains the following tuples:

```prolog
aavg("one", 3.0)
aavg("two", 4.0)
```


A rule with an assignment using an aggregation operator has the general form:

```prolog
q(K1, …, Kn, J) :- body, J = maggr(x, <C1, …, Cm>)
```

where:

- `K1, …, Kn` are zero or more group by arguments
- `body` is the rule body,
- `maggr` is the aggregation function desired (`mmin`, `mmax`, `msum`,
  `mprod`),
- `C1, …, Cm` are zero or more variables of the body (with `Ci ≠ Kj, 1 ≤ i ≤ m,
1 ≤ j ≤ n`), which we call contributor arguments
- `x` is a constant, a body variable or an expression containing only
  single-fact operators.

For each distinct n-tuple of `K1, …, Kn`, a monotonic increasing (or decreasing)
aggregate function `maggr` maps an input multi-set of vectors G, each of the
form `gi = (C1, … , Cm, xi)` into a set D of values, such that xi is in D if xi
is less (greater) than the previously observed value for the sub-vector of
contributors (`C1, …, Cٖm`).

Such aggregation functions are monotonic with respect to the set containment and
can be used in Vadalog together with recursive rules to calculate aggregates
without resorting to stratification (separation of the program into ordered
levels on the basis of the dependencies between rules).

In the execution of a program, for each aggregation, the aggregation memorizes
for each vector (`C1, …, Cٖm`) the current minimum (or maximum) value of x.
Then, for each activation of a rule with the monotonic aggregation at hand, an
updated value for the group selected by `K1, …, Km` is calculated by combining
all the values in D for the various vectors of contributors.

The kind of combination specifically depends on the semantics of `maggr` (e.g.
minimum, maximum, sum, product, count) and, provided the monotonicity of the
aggregates, it is easily calculated by memorizing a current aggregate, which is
updated with the new contributions brought by the sequence of rule activations.

The following assumption is made:

> if a position _pos_ in a head for predicate _p_ is calculated with an
> aggregate function, whenever a head for _p_ appears in any other rule, _pos_
> must be existentially quantified and calculated with the same aggregate
> function.

This assumption guarantees the homogeneity of the facts with existentially
aggregated functions.

Let us start with a basic example.

```prolog showLineNumbers {7}
s(1.0, "a").
s(2.0, "a").
s(3.0, "a").
s(4.0, "b").
s(3.0, "b").

f(J, Y) :- s(X, Y), J = msum(X).
@output("f").
```

The expected output is:

```
f(6, "a").
f(7, "b").
```

For each activation of the aggregation operator `msum`, we calculate the current
aggregate, for each group, denoted by variable Y in f. So for the first group,
"a", we have 1, and than 3=1+2. For the second group, "b", we have 4 and then
7=4+3.

This example gives the flavour of how monotonic aggregations work. For each
activation of the rule, the current result is produced. Since the aggregations
are monotonic, we are certain that the maximum (or minimum) value for each group
is deterministically the correct aggregate.

On the other hand, the intermediate values for partial aggregates are
_non-deterministic_, since they depend on the specific execution order.

Let us now consider contributors through the following example.

```prolog showLineNumbers {7}
s(0.1, 2, "a").
s(0.2, 2, "a").
s(0.5, 3, "a").
s(0.6, 4, "b").
s(0.5, 5, "b").

f(J, Z) :- s(X, Y, Z), J = mprod(X,<Y>).
@output("f").
```

Here we want to calculate the monotonic product aggregation of the values for X,
grouped by Z. Besides, we specify that Y denotes the specific contributor to the
product.

This means that in the aggregation, we multiply X for distinct values of Y.
Whenever there are two facts within the same group that refer to the same
contributor, then we consider only the one with the smallest contribution on X.

Observe, that if the aggregation operator were monotonically increasing, we
would consider the fact with the greatest contribution.

Therefore, the expected result is:

```prolog
f(0.05,"a").
f(0.3,"b").
```

The first activation of the rule produces 0.1. Then, for the second one, since
both s(0.1,2,"a") and s(0.2,2,"a") contribute to the group "a" for the
contributor 2, then we consider only the first one, as it gives the smaller
contribution.

Hence the partial result is still 0.1. Finally we multiply it by 0.5 and get
0.05, since 0.5 comes for a distinct contributor, 3. For group "b", the
situation is simpler, as the two factors are related to different contributors.

```prolog showLineNumbers {6}
edge(1,2).
edge(3,2).
edge(5,2).
edge(3,1).
edge(2,5).
indegree(Y, J) :- edge(X, Y), J = msum(1, <X>).
found(X) :- indegree(X, J), J > 2.
@output("found").
```

The expected result is:

```prolog
found(2).
```

In this example, all the intermediate results have been simply discarded by
introducing the threshold, technically a condition, `J > 2`.

In addition, Vadalog Parallel provides an annotation mechanism that allows to
introduce special behaviors, pre-processing and post-processing features. A
post-processing annotation can be used to filter only the maximum (or minimum)
values for each group as follows (see the section on
[Post-processing](/learn/vadalog/annotations#post-processing-with-post) for more details).

```prolog showLineNumbers {9}
s(1.0, "a").
s(2.0, "a").
s(3.0, "a").
s(4.0, "b").
s(3.0, "b").

f(J, Y) :- s(X, Y), J = msum(X).
@output("f").
@post("f", "mmax(1)").
```

The aggregates `mmin` and `mmax` have the expected semantics with the difference
that they produce no intermediate results.

Consider for example the following program.

```prolog showLineNumbers {5}
b(1, 2).
b(1, 3).
b(2, 5).
b(2, 7).
h(X, Z) :- b(X, Y), Z = mmax(Y), X > 0.

@output("h").
```

The output (listed below) does _not_ include the intermediate results:

```
h(1, 3).
h(2, 7).
```

These operations can also be used to compute the rest of the aggregate
operations without intermediate results.

For example, the following program computes the sum of positive values.

```prolog showLineNumbers {7,8}
b(1, 2).
b(1, 3).

b(2, 5).
b(2, 7).

b_msum(X, Z):- b(X, Y), Z = msum(Y).
b_sum(X, Z) :- b_msum(X, Y), Z = mmax(Y).

@output("b_sum").
```

The expected result is

```
b_sum(1, 5).
b_sum(2, 12).
```

The aggregate `mcount` has the expected semantics and does not produce any
intermediate results.

Consider for example the following program.

```prolog showLineNumbers {6}
b(1, 2).
b(1, 3).
b(2, 5).
b(2, 7).
b(2, 9).
h(X, Z) :- b(X, Y), Z = mcount(Y), X > 0.

@output("h").
```

The expected output is

```
h(1, 2).
h(2, 3).
```

To combine some properties into a set, you can simply do the following:

```prolog {5}
c(15552,"Name").
c(15552,"Synonym").
c(15552,"Alternative").

synonyms(Id, NewSynonyms) :- c(Id,Synonym), NewSynonyms = munion({}|Synonym).
```

The aggregate `maxcount` returns the key tuple with the highest frequency

```prolog
@output("hotspot").
affects("Component1","Component2").
affects("Component3","Component2").
affects("Component4","Component2").
affects("Component5","Component1").
affects("Component2","Component1").
affects("Component6","Component7").
hotspot(Component2,MaxCount) :- affects(Component1,Component2), MaxCount=maxcount().
```

The expected output is

```
hotspot("Component2", 3).
```


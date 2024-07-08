# Distributed and Parallel (DP) Reasoning

:::warning
Do we need to keep this
:::

Distributed and parallel (DP) reasoning add the native support for distributing and parallelising the data processing. To leverage paralellism, DP Vadalog programs respect the Peice Wise Linear Warded (PWL) fragment, that allows a restricted use of recursion: the body of a Vadalog rule contains at most one atom whose predicate is mutually recursive with a predicate in the head.

## Parallel Semi Naive Evaluation

Distributed Vadalog adopts an evaluation technique called Semi-naive.
This technique is an efficient methodology that does not produce any duplicate facts. Specifically, it is a bottom-up evaluation technique, which starts from the initial database and performs a repeated application of the rules until a fixpoint is reached.

**Example**

```
own("CompanyA", "CompanyB", 0.6).
control(X,Y) :- own(X,Y,Z), Z > 0.6.
@output("control").
@executionMode("distributed").
```

## Parallel Semi Naive Aggregate Evaluation (P-SNA)

DP evaluation comes with the use of stratification. In case of monotonic increasing DP evaluation may produce different output results w.r.t. the streaming approach.

```
s(1.0,"a").
s(2.0,"a").
s(3.0,"a").
s(4.0,"b").
s(3.0,"b").

f(J,Y) :- s(X,Y), J = msum(X).
@output("f").
@executionMode("distributed").
```

The expected output is:

```
f(6.0,"a").  f(7.0,"b").
```

In this case partial results are accumulated at the monotonic rule stratum level and only the final result of the aggregation is produced.

## Connectors for external sources

Vadalog Parallel interacts with external data sources through the connectors, in this case, all the data flows directly from/to the external sources to the memory of the executors. This enables a parallel reading/writing of the data from/to the external sources and it is much more efficient than the record manager’s strategy.

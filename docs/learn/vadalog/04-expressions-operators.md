# Expressions and operators

An **expression** is inductively defined as follows:

1. a constant is an expression
2. a variable is an expression
3. a proper combination of expressions (by means of operators) is an expression.

They appear in specific parts of a Vadalog program, namely in **operators**,
**conditions** and **assignments**, as we will see.

## Operators

Vadalog supports built-in operations over values of data types. These operations
allow to compare values, perform arithmetics, manipulate strings and datetime
values. Operations are supported through symbolic operators, which can be
_prefix_, _infix_ or _functional-style_.

Vadalog supports _single-fact operators_ (simply called operators) and
_multi-facts operators_ (called **aggregation operators**).

## Single-fact operators

| Data type     | Operators                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| all           | `==`, `>`, `<`, `>=`, `<=`, `<>`, `!=`                                                                  |
| string        | `substring`, `contains`, `starts_with`, `ends_with`, `concat`, `index_of`, `string_length`, `to_lower`, `to_upper`, `split` |
| list          | `concat`, `contains`                                                                              |
| integer       | (monadic) `-`, `*`, `/`, `+`, `-`, `( )`                                                                |
| double        | (monadic) `-`, `*`, `/`, `+`, `-`, `( )`                                                                |
| Boolean       | `&&` (and), `\|\|` (or), `not`, `( )` for associativity                                                    |
| set           | `\|` (union), `&` (intersection), `( )` for associativity                                                  |


### Comparison operators

The comparison operators are `==`,`>`,`<`,`>=`,`<=`,`<>` (alternate syntax
`!=`). They can be used to compare literals of any data type and return a
Boolean, depending whether the comparison is satisfied or not. Only values of
the same type can be compared.

- `==` : equals to
- `>` : greater than
- `<` : less than
- `>=` : greater or equal
- `<=` : less or equal
- `<>` : not equal
- `!=` : not equal

Marked nulls can be compared only with marked nulls, since they are the only
ones having unknown data type. Marked nulls are equal when they have the same
identifier (i.e. they are the same marked null).

### Arithmetic operators

The arithmetic operators are `_` (multiplication), `/` (division), `+`
(addition), `-` (subtraction). Infix `_`, `/`, `+`, `-` can be applied to all
numeric (integer and double) operands, with an implicit upcast to double if any
double is involved.

The operator `+` (plus) also performs string concatination with an implicit
upcast to string if any string is involved.

The operator `-` (minus) also exists in its monadic version, which simply
inverts the sign of a numeric value.

Division by 0 always fails, causing the program to abort.

Operations associate to the left, except that multiplication and division
operators have higher precedence than addition and subtraction operators.

Precedence can be altered with parentheses.

### Boolean operators

The Boolean operators are and (`&&`), or (`||`) or `not`. They can be used to
combine Boolean data types.

### String operators

The String operators are `substring`, `contains`, `starts_with`, `ends_with`, `concat`, `+`, `index_of`, `string_length`, `to_lower`, `to_upper`, and `split`. These operators allow manipulation and comparison of `String` values.

#### `substring`
A rule using `substring` returns a substring from the specified `start` to `end` index, using zero-based indexing:

```prolog
q(K1, K2, Kn, J) :- body, J = substring(x, start, end).
```

Example:

```prolog showLineNumbers {3}
a("prometheux").
b("oxford").
q(Y,J) :- a(X), b(Y), J = substring(X,4,10).
@output("q").
```

Expected output:

```prolog
q("oxford", "metheux").
```

#### `starts_with`
A rule with `starts_with` returns true if the `string` starts with `start_string`:

```prolog
q(K1, K2, Kn, J) :- body, J = starts_with(string, start_string).
```

Example:

```prolog showLineNumbers {3}
a("prometheux").
b("prom").
q(X,Y,J) :- a(X), b(Y), J = starts_with(X,Y).
@output("q").
```

Expected output:

```prolog
q("prometheux", "prom", #T).
```

#### `ends_with`
A rule with `ends_with` returns true if the `string` ends with `end_string`:

```prolog
q(K1, K2, Kn, J) :- body, J = ends_with(string, end_string).
```

Example:

```prolog showLineNumbers {3}
a("prometheux").
b("theux").
q(X, Y, J) :- a(X), b(Y), J = ends_with(X,Y).
@output("q").
```

Expected output:

```prolog
q("prometheux", "theux", #T).
```

#### `concat`
A rule with `concat` returns the concatenation of `string` and `concat_string`:

```prolog
q(K1, K2, Kn, J) :- body, J = concat(string, concat_string).
```

Example:

```prolog showLineNumbers {3}
a("prometheux").
b("engine").
q(X,Y,J) :- a(X), b(Y), J = concat(X,Y).
@output("q").
```

Expected output:

```prolog
q("prometheux", "engine", "prometheuxengine").
```

#### `string_length`
A rule with `string_length` returns an integer representing the length of the `string`:

```prolog
q(K1, K2, Kn, J) :- body, J = string_length(string).
```

Example:

```prolog showLineNumbers {2}
a("prometheux").
q(X, J) :- a(X), J = string_length(X).
@output("q").
```

Expected output:

```prolog
q("prometheux", 10).
```

#### `to_lower`
A rule with `to_lower` converts `string` to lowercase:

```prolog
q(K1, K2, Kn, J) :- body, J = to_lower(string).
```

Example:

```prolog showLineNumbers {2}
a("Prometheux").
q(X, J) :- a(X), J = to_lower(X).
@output("q").
```

Expected output:

```prolog
q("Prometheux", "prometheux").
```

#### `to_upper`
A rule with `to_upper` converts `string` to uppercase:

```prolog
q(K1, K2, Kn, J) :- body, J = to_upper(string).
```

Example:

```prolog showLineNumbers {2}
a("prometheux").
q(X, J) :- a(X), J = to_upper(X).
@output("q").
```

Expected output:

```prolog
q("prometheux", "PROMETHEUX").
```

#### `split`
A rule with `split` divides `string` by a specified delimiter, producing a list of substrings:

```prolog
q(K1, K2, Kn, J) :- body, J = split(string, delimiter).
```

Example:

```prolog showLineNumbers {2}
a("prometheux engine").
q(X, J) :- a(X), J = split(X, " ").
@output("q").
```

Expected output:

```prolog
q("prometheux engine", ["prometheux", "engine"]).
```

#### `index_of`
A rule with `index_of` finds the index of `substring` within `string`, returning -1 if not found:

```prolog
q(K1, K2, Kn, J) :- body, J = index_of(string, substring).
```

Example:

```prolog showLineNumbers {3}
a("prometheux").
b("theux").
q(X, Y, J) :- a(X), b(Y), J = index_of(X,Y).
@output("q").
```

Expected output:

```prolog
q("prometheux", "theux", 4).
```


### Math operators

These are implemented in the library, `math`. The supported mathematical
operators are:

- `mod`: computes a modulo between two parameters provided, returning a single
  integer value.
- `sqrt(X)`: computes square root of `X`, returning a single double value.
- `abs(X)`: computes the absolute value of `X`.
- `min(X1, …, Xn)`: computes the minimum value among `X1, … , Xn`. These
  parameters must be of the same type.
- `max(X1, …, Xn)`: computes the maximum value among `X1, … , Xn`. These
  parameters must be of the same type.
- `log10(X)`: computes the lograrithm of `X` to base 10.
- `log(X)`: computes the natural logarithm of `X`.
- `pow(X,Y)`: computes `X` to the power of `Y`. Returns a value of type double.
- `exp(X)`: computes `e^X`.
- `round(X)`: returns the closest integer to `X`.
- `ceil(X)`: computes the smallest integer `Y` that is equal to or greater than
  `X`.
- `floor(X)`: computes the largest integer `Y` that is equal to or smaller than
  `X`.
- `sin(X), cos(X), tan(X)`: the usual trigonometric functions.
- `PI(X)`: gives the number Pi.
- `E(X)`: gives the e number.
- `rand(X)`: produces a random double number greater than or equal to `0.0` and
  less than `1.0`.

To use any of these, add the library prefix `math:`. For example:

```
rule(X, SomeValue) :- fact(X), SomeValue=math:rand(Y).
```

### Hash operators

The `hashCode` library provides support for computing various hash functions.
Currently supported are the following cryptographic hash functions:

- `hash(X1, …, Xn)`
- `md5(X1, …, Xn)`
- `sha1(X1, …, Xn)`

To use any of these, add the library prefix `hashCode:`. For example:

```
rule(X, Hash) :- fact(X), Hash = hashCode:md5(X).
```

### List operators

The List operators are `contains` and `concat`.

```prolog showLineNumbers
a([1]).
b(Y) :- a(X), Z=([2]) Y=concat(X, Z).
@output("b").
```

The expected output is:

```prolog
b([1, 2]).
```

The Boolean list operator `contains(List, Element)` returns true if `List`
contains `Element`:

```prolog showLineNumbers {4}
a([0, 1, 2, 3, 4, 5]).
b(3).
b(2).
c(Y,J) :- a(X), b(Y), J = contains(X,Y).
@output("c").
```

The expected output is:

```
c(3, #T).
c(2, #F).
```

### Collections

The library `collections` implements functions for basic manipulation of
collections, such as lists and sets..

- `size(X)`: returns the size of the collection `X`.
- `contains(X, Y)`: returns `true` if `Y` is in `X`, `false` otherwise.
- `contains_all(X, Y)`: returns `true` if collection X contains all the elements
  of collection Y, `false` otherwise.
- `sort(X)`: returns a copy of the list `X` with elements sorted in ascending
  order.
- `get(X, Y)`: returns the item at position `Y` in collection `X`.
- `add(X, Y)`: returns a copy of the collection `X` with the element `Y` added
  to the collection. In case 'X' is a list, 'Y' is added to the end of 'X'.
- `union(X, Y)`: returns the union of collections `X` and `Y`. In case both `X`
  and `Y` are lists, `Y` is appended to `X`.
- `intersection(X, Y)`: returns a copy of the collection `X` which contains
  elements from the collection `Y`.
- `difference(X, Y)`: returns a copy of the collection `X` which does not
  contain elements from the collection `Y`.
- `transform(Arr,StringLambdaF)`: Returns an array of elements after applying a transformation to each element in the input array.
- `filter(Arr,StringLambdaF)`: Returns an array of elements for which a predicate holds in a given array.

To use any of these, add the library prefix `collections:`. For example:

```prolog
rule(X, Size) :- fact(X), Size = collections:size(X).
```

Example using lambda functions:

```prolog
input([1,2,3]).

transformed(T) :- input(X), T = collections:transform(X, "x -> x+1").

input([1,2,3]).

transformed(T) :- input(X), T = transform(X, "(x, i) -> x + i"). % prepending collections: is optional for transform

input([1,2,3,4]).
filtered(Out) :- input(Arr), Out = filter(Arr, "x -> x>2"). prepending collections: is optional for filter

input([10,20,30,40]).
filtered(Out) :- input(Arr), Out = collections:filter(Arr, "(x, i) -> i % 2 != 0").
```

### Null Functions
The library `nullManagement` implements functions for handling null values
- `coalesce(A, B, C, …)`: returns the first value from the list of arguments that is not null.

To use any of these, add the library prefix `nullManagement:`. For example:

```prolog
choice(Chosen) :- choose_from(OptionA, OptionB),
                  or_from(OptionC),
                  Chosen = nullManagment:coalesce(OptionB, OptionC, OptionA).
```

### Cast Datatypes Functions
The library `dataTypes` implements functions for casting of data types 
- `as_string(X)`: casts X to string datatype.
- `as_int(X)`: casts X to int datatype.
- `as_double(X)`: casts X to double datatype.
- `as_long(X)`: casts X to long datatype.
- `as_date(X)`: casts X to date datatype.

```prolog
a(D) :- b(X), D = as_date("22-02-2022").
```

### Temporal Functions
The library `date` implements functions for manipulation of temporal operations 
- `current_date()`: returns the current date at the start of reasoning evaluation as a date.
- `current_timestamp()`: returns the current date at the start of query evaluation as a date.
- `next_day(Date)`: returns the date that is one days after Date
- `add(Start,Days)`: returns the date that is Days days after Start
- `prev_day(Date)`: returns the date that is one days before Date
- `sub(Start,Days)`: returns the date that is Days days before Start
- `diff(End,Start)`: returns the number of days from Start to End.
- `to_timestamp(DateExpr, Format)` : returns a timestamp value by converting the given input string according to the specified format.
- `format(DateExpr, Format)`: date/timestamp/string to a value of string in the format specified by the date format given by the second argument

This program defines rules for working with dates. The rule `a(D)` assigns the current date to `D`. The rule `next_day(Next)` calculates the next day from the current date. The rule `add_ten_days(Next)` adds ten days to the current date.

```prolog
a(D) :- b(X), D = date:current_date().
next_day(Next) :- a(D), Next = date:next_day(D).
add_ten_days(Next) :- a(D), Next = date:add(D,10).
```

This program defines rules for converting and formatting date strings. The `myDates` facts store raw date strings. The rule `tmpDates(Raw, Ts)` converts raw date strings to timestamps. The rule `convertedDates(Raw, Formatted)` formats the timestamps into ISO 8601 format.

```prolog
myDates("23-2-11 16:47:35,985 +0000").
myDates("23-2-12 17:00:00,123 +0000").

tmpDates(Raw, Ts) :-
  myDates(Raw),
  Ts = date:to_timestamp(Raw, "yy-M-dd HH:mm:ss,SSS Z").

convertedDates(Raw, Formatted) :-
  tmpDates(Raw, Ts),
  Formatted = date:format(Ts, "yyyy-MM-dd'T'HH:mm:ssZ").
```

## Negation

Negation is a prefix modifier that negates the truth value for an atom. In logic
terms, we say that a negated formula holds whenever it is false, for example
`not employee(X)` holds if `X` is not an employee. Negation has higher
precedence than conjunction, so the single atoms are negated and not the entire
body (or parts thereof).

The following assumptions are made:

1. Every variable that occurs in the head must have a binding in a non-negated
   atom.
2. Every binding of a variable that occurs only in a negation is not exported
   outside of the negation.

It is clear that assumption 2 implies assumption 1: as the bindings captured
within the negation cannot be used outside the negation itself, they cannot be
used to generate new facts in the head.

However 2 is more specific, since it even forbids joins in the body based on
negatively bound variables.

Whereas assumption 1 is enforced in the Engine and its violation causes a
runtime error, condition 2 is not enforced and negatively bound joins can be
used (albeit discouraged), being aware of the theoretical and practical
implications.

```prolog showLineNumbers {10}
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

```
safeProjects(2, "Ruth").
safeProjects(3, "Jane").
```

Here we select the safe projects, which are those run by a person who is not a
contractor. Since a person can have various company attributes (`employee`,
`hired`, etc.), even at the same time, here we simply check that he/she is not a
contractor.

Consider this next example:

```prolog showLineNumbers {10,11}
s(1, 2).
s(2, 3).
s(3, 5).
s(4, 6).
b(6, 2).
b(4, 2).
b(2, 2).
c(2).

f(X, Y) :- s(X, Y), not b(Y, Z).
f(Y, X) :- f(X, Y), not b(X, Z).

@output("f").
```

The expected result is:

```
f(5, 3).
f(2, 3).
f(3, 5).
```

Here we combine recursion and negation and recursively generate f, by negating
b.

## Conditions

Rules can be enriched with conditions in order to constrain specific values for
variables of the body. Syntactically, the conditions follow the body of the
rule. A condition is the comparison (`>,<,==,>=,<=,<>`) of a variable (the LHS of
the comparison) of the body and an **expression** (the RHS of the comparison).

Notice that although the comparison symbols used in conditions are partially
overlapped with the symbols for comparison operators they have different semantics. 
While comparison operators calculate Boolean results, comparison symbols in conditions
only specify a filter.

Each rule can have multiple comma-separated conditions.

```prolog showLineNumbers {3}
contract("Mark",14).
contract("Jeff",22).
rich(X) :- contract(X,Y),Y>=20.
@output("rich").
```

In the example we individuate the contracts for `Y>=20` and classify the
respective employee as rich. The expected result is:

```
rich("Jeff").
```

Consider this next example:

```prolog showLineNumbers {3}
balanceItem(1, 7, 2, 5).
balanceItem(2, 2, 2, 7).
error(E, I) :- balanceItem(I, X, Y, Z), X <> Y+Z.
@output("error").
```

Here, we individuate the balance items for which X is different from the sum of
Y and Z and report an error E for the identifier I of such an item. The expected
result is:

```
error(_e, 2).
```

This next example selects the senior English players.

```prolog showLineNumbers {13}
player(1, "Chelsea").
age(1, 24).
player(2, "Bayern").
team("Chelsea").
age(2, 25).
player(2, "Bayern").
team("Chelsea").
age(2, 25).
player(3, "Chelsea").
age(3, 18).
team("Chelsea").
team("Bayern").
seniorEnglish(X) :- player(X, Y), team(Y), age(X, A), Y=="Chelsea", A > 20.
@output("seniorEnglish").
```

They are those who play with Chelsea with age greater than 20. The expected
result is:

```
seniorEnglish(1).
```

## Assignment

Rules can be enriched with assignments in order to generate specific values for
existentially quantified variables of the head. Syntactically, the assignments
follow the body of the rule. An assignment is the equation (`=`) of a variable
(the LHS of the equation) of the body and an expression (the RHS of the
equation).

Each rule can have multiple comma-separated assignments.

```prolog showLineNumbers {3,4}
balanceItem("loans", 23.0).
balanceItem("deposits", 20.0).
operations(Q, Z, A) :- balanceItem(I1,X), balanceItem(I2,Y),
                       I1=="loans", I2=="deposits", 
                       Z=X+Y, 
                       A=(X+Y)/2.
@output("operations").
```

This example generates a fact for operations, summing two balance items, one for
loans and one for deposits. Observe that `I1=="loans"` and `I2=="deposits"` are
conditions to select the `balanceItems` (as I1 and I2 appear in the body),
whereas `Z=X+Y` and `A=(X+Y)/2` are assignments (as Z and A do not appear in the
body).

The expected result is:

```
operations(_q, 43, 21.5).
```

## Recursion

We say that a Vadalog program or ontology is **recursive** if the dependency
graph implied by the rules is cyclical. The simplest form of recursion is that
in which the head of a rule also appears in the body (_self-recursive rules_).

Recursion is particularly powerful as it allows for inference based on
previously inferred results.

In self-recursive rules, in case of bodies with two atoms, we distinguish
between:

1. _left recursion_, where the recursive atom is the left-most;
2. _right recursion_, where the recursive atom is the right-most.

Some examples follow.

```prolog showLineNumbers {6}
edge(1, 2).
edge(2, 3).
edge(1, 4).
edge(4, 5).
path(X, Y) :- edge(X, Y).
path(X, Z) :- path(Y, Z), edge(X, Y).
@output("path").
```

The expected results are:

```
path(1, 3).
path(1, 2).
path(1, 5).
path(2, 3).
path(1, 4).
path(4, 5).
```

The examples above show reachability in graphs with left recursion, in the
extended version of the manual further examples.

## Aggregations

Aggregations are functions for incremental and recursion-friendly
computation of aggregate values. They mainstain state outside of the program, allowing you to perform calculations across recursive steps.

The functions are:

- `msum(X, [K1, …, Kn], [C1, …, Cm])` for the incremental computation of sums
- `mprod(X, [K1, …, Kn], [C1, …, Cm])` for the incremental computation of
  products
- `mcount(K1, K2, …)` for the incremental computation of counts
- `mmin(X, K1, K2, …)` for the incremental computation of minimal
- `mmax(X, K1, K2, …)` for the incremental computation of maximal
- `munion(X, K1, K2, …)` for the incremental union of sets

Upon invocation, all functions return the currently accumulated value for the
respective aggregate. All functions, except `mcount`, take as first argument the
value to be used in the incremental computation of the aggregation.

For `msum` and `mprod`, the second argument is the list of group-by variables,
and the third argument is the list of contributors.

Finally, all functions besides `msum` and `mprod` take a list of values, called
keys, to be used as a group identifier (i.e. they play the role of group by
variables in standard SQL).

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

@output("ssum").
@output("pprod").
@output("pmin").
@output("pmax").
@output("ccount").
@output("ccount_other").
```

After execution, the relation `ssum` could contain the following tuples:

```prolog
ssum("one", 12.0)
ssum("two", 19.0)
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
[Post-processing](./annotations#post-processing-with-post) for more details).

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

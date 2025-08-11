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
| Boolean       | `&&` and([args], `\|\|`, or(args), `not`, `( )` for associativity                                                    |
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


### Logical operators

Vadalog supports a comprehensive set of logical operators that allow for combining and manipulating Boolean expressions. These operators can be used to evaluate complex logical conditions and can be assigned to variables for further processing.

#### `and(args)`
The `and(args)` operator evaluates to true if all the conditions in `args` are true. You can assign the result to a variable and use `==#T` to enforce that all conditions must be true.

**Example 1: Basic `and(args)` usage**

This example shows the use of the `and(args)` operator to evaluate multiple conditions on the variable `X`. The rule `b(X, IsIn)` checks if `X` is greater than 2, less than 5, and equal to 3. The result of this conjunction is stored in `IsIn`.

```prolog
@output("b").
a(1).
a(2).
a(3).
a(4).
a(5).
b(X, IsIn) :- a(X), IsIn=and(X>2, X<5, X==3).
```

**Expected output:**

```prolog
b(1, #F).
b(2, #F).
b(3, #T).
b(4, #F).
b(5, #F).
```

#### `or(args)`
The `or(args)` operator evaluates to true if any of the conditions in `args` are true. You can assign the result to a variable and use `==#T` to enforce that at least one condition must be true.

**Example 2: Basic `or(args)` usage**

This example illustrates the use of the `or(args)` operator to evaluate multiple conditions on the variable `X`. The rule `b(X, IsIn)` checks if `X` is less than 2, equal to 4, or equal to 6. The result of this disjunction is stored in `IsIn`.

```prolog
@output("b").
a(1).
a(2).
a(3).
a(4).
a(5).
b(X, IsIn) :- a(X), IsIn=or(X<2, X==4, X==6).
```

**Expected output:**

```prolog
b(1, #T).
b(2, #F).
b(3, #F).
b(4, #T).
b(5, #F).
```

#### `not(expression)`
The `not(expression)` operator negates the Boolean value of the expression. It returns `#T` if the expression is `#F`, and `#F` if the expression is `#T`.

**Example 3: Basic `not(expression)` usage**

This example demonstrates the use of the `not` operator to negate a condition.

```prolog
@output("b").
a(1).
a(2).
a(3).
b(X, IsNotTwo) :- a(X), IsNotTwo=not(X==2).
```

**Expected output:**

```prolog
b(1, #T).
b(2, #F).
b(3, #T).
```

#### `xor(expression1, expression2)`
The `xor(expression1, expression2)` operator (exclusive or) evaluates to true if exactly one of the two expressions is true, but not both.

**Example 4: Basic `xor(expression1, expression2)` usage**

This example shows the exclusive or operation between two conditions.

```prolog
@output("b").
a(1).
a(2).
a(3).
b(X, IsExclusive) :- a(X), IsExclusive=xor(X>1, X<3).
```

**Expected output:**

```prolog
b(1, #F).
b(2, #F).
b(3, #T).
```

#### `nand(expression1, expression2)`
The `nand(expression1, expression2)` operator (not and) evaluates to true if at least one of the expressions is false.

**Example 5: Basic `nand(expression1, expression2)` usage**

This example demonstrates the NAND operation.

```prolog
@output("b").
a(1).
a(2).
a(3).
b(X, IsNand) :- a(X), IsNand=nand(X>1, X<3).
```

**Expected output:**

```prolog
b(1, #T).
b(2, #F).
b(3, #T).
```

#### `nor(expression1, expression2)`
The `nor(expression1, expression2)` operator (not or) evaluates to true only if both expressions are false.

**Example 6: Basic `nor(expression1, expression2)` usage**

This example demonstrates the NOR operation.

```prolog
@output("b").
a(1).
a(2).
a(3).
b(X, IsNor) :- a(X), IsNor=nor(X>1, X<3).
```

**Expected output:**

```prolog
b(1, #F).
b(2, #F).
b(3, #F).
```

#### `xnor(expression1, expression2)`
The `xnor(expression1, expression2)` operator (exclusive nor) evaluates to true if both expressions have the same Boolean value.

**Example 7: Basic `xnor(expression1, expression2)` usage**

This example demonstrates the XNOR operation.

```prolog
@output("b").
a(1).
a(2).
a(3).
b(X, IsXnor) :- a(X), IsXnor=xnor(X>1, X<3).
```

**Expected output:**

```prolog
b(1, #T).
b(2, #T).
b(3, #F).
```

#### `implies(expression1, expression2)`
The `implies(expression1, expression2)` operator (implication) evaluates to false only if the first expression is true and the second is false.

**Example 8: Basic `implies(expression1, expression2)` usage**

This example demonstrates logical implication.

```prolog
@output("b").
a(1).
a(2).
a(3).
b(X, IsImplied) :- a(X), IsImplied=implies(X>1, X<3).
```

**Expected output:**

```prolog
b(1, #T).
b(2, #T).
b(3, #F).
```

#### `iff(expression1, expression2)`
The `iff(expression1, expression2)` operator (if and only if) evaluates to true if both expressions have the same Boolean value.

**Example 9: Basic `iff(expression1, expression2)` usage**

This example demonstrates the if and only if operation.

```prolog
@output("b").
a(1).
a(2).
a(3).
b(X, IsIff) :- a(X), IsIff=iff(X>1, X<3).
```

**Expected output:**

```prolog
b(1, #T).
b(2, #T).
b(3, #F).
```

#### `if(condition, true_value, false_value)`
The `if(condition, true_value, false_value)` operator provides conditional logic. It returns `true_value` if the condition is true, otherwise it returns `false_value`.

**Example 10: Basic `if(condition, true_value, false_value)` usage**

This example demonstrates conditional logic using the `if` operator to classify numbers as positive or non-positive.

```prolog
@output("b").
a(1).
a(-1).
b(Result, Value) :- a(Value), GTZero=Value>0, Result=if(GTZero, "positive", "non-positive").
```

**Expected output:**

```prolog
b("positive", 1).
b("non-positive", -1).
```

**Example 11: String condition with `if` operator**

This example uses the `if` operator to check if a string is empty and return appropriate labels.

```prolog
@output("b").
a("").
a("NonEmpty").
a(" ").
b(El, IsEmpty) :- a(El), IsEmpty=if(is_empty(El), "is_empty", "is_not_empty").
```

**Expected output:**

```prolog
b("", "is_empty").
b("NonEmpty", "is_not_empty").
b(" ", "is_not_empty").
```

**Example 12: Null check with `if` operator**

This example uses the `if` operator to check if a string is not null and return appropriate labels.

```prolog
@output("b").
a("hello").
a("not_null").
b(El, State) :- a(El), State=if(is_not_null(El), "not_null", "is_null").
```

**Expected output:**

```prolog
b("hello", "not_null").
b("not_null", "not_null").
```

**Example 13: Nested `if` statements for credit rating**

This example demonstrates complex nested `if` statements to implement a credit rating system based on credit scores. Each nested `if` evaluates a range of credit scores and assigns a corresponding rating value.

```prolog
@output("credit_rating").
credit_score(450.0).
credit_score(580.0).
credit_score(720.0).
credit_score(780.0).
credit_score(820.0).
credit_score(850.0).
credit_score(920.0).

credit_rating(Val) :- credit_score(Score), Val = if(Score < 500.0, -3.250,
                                                    if(and(Score >= 500.0, Score < 600.0), -2.150,
                                                    if(and(Score >= 600.0, Score < 700.0), -1.200,
                                                    if(and(Score >= 700.0, Score < 750.0), -0.500,
                                                    if(and(Score >= 750.0, Score < 800.0), 0.250,
                                                    if(and(Score >= 800.0, Score < 850.0), 0.750,
                                                    if(and(Score >= 850.0, Score < 900.0), 1.200,
                                                    if(and(Score >= 900.0, Score < 950.0), 1.650,
                                                    if(and(Score >= 950.0, Score < 1000.0), 2.100,
                                                    if(and(Score >= 1000.0, Score < 1100.0), 2.550, 
                                                                                            3.000)))))))))).
```

**Expected output:**

```prolog
credit_rating(-3.250).
credit_rating(-2.150).
credit_rating(-1.200).
credit_rating(-0.500).
credit_rating(0.250).
credit_rating(0.750).
credit_rating(1.200).
```

**Example 14: Using `and(args)` with condition enforcement**

In this example, the `and(args)` operator is used to evaluate conditions on `X`, and the result is compared to `#T` to enforce that all conditions must be true. The rule `b(X)` only succeeds if `X` is greater than 2, less than 5, and equal to 3.

```prolog
@output("b").
a(1).
a(2).
a(3).
a(4).
a(5).
b(X) :- a(X), IsIn=and(X>2, X<5, X==3), IsIn==#T.
```

**Expected output:**

```prolog
b(3).
```

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
- `round(X)`: returns `X` rounded to 0 decimal with HALF_UP round mode.
- `round(X,Y)`: returns `X` rounded to `Y` decimal places with HALF_UP round mode if `scale` is greater than or equal to 0 or at integral part when `scale` is less than 0.
- `bround(X)` : returns `X` rounded to 0 decimal with HALF_UP round mode.
- `bround(X,Y)` : returns `X` rounded to `Y` decimal places with HALF_UP round mode if `scale` is greater than or equal to 0 or at integral part when `scale` is less than 0.
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
Lambda `filter` and `transform` functions are compliant with Apache Spark SQL functions Library nomenclature.

Examples using lambda functions:

```prolog
input([1,2,3]).

transformed(T) :- input(X), T = collections:transform(X, "x -> x+1").

input([1,2,3]).

transformed(T) :- input(X), T = transform(X, "(x, i) -> x + i"). % prepending collections: is optional for transform

input([1,2,3,4]).
filtered(Out) :- input(Arr), Out = filter(Arr, "x -> x>2"). % prepending collections: is optional for filter

input([10,20,30,40]).
filtered(Out) :- input(Arr), Out = collections:filter(Arr, "(x, i) -> i % 2 != 0").
```

Example using lambda functions to group databases related to specific pharmaceutical components from the `robokopkg.renci.org` KG

```prolog
@qbind("node","neo4j host='robokopkg.renci.org'","neo4j",
                    "
                    MATCH (n:`biolink:Gene`) RETURN 
                    'Gene', n.equivalent_identifiers 
                    LIMIT 50000
                    ").
@qbind("node","neo4j host='robokopkg.renci.org'","neo4j",
                    "
                    MATCH (n:`biolink:Pathway`) RETURN 
                    'Pathway', n.equivalent_identifiers 
                    LIMIT 50000
                    ").
@qbind("node","neo4j host='robokopkg.renci.org'","neo4j",
                    "
                    MATCH (n:`biolink:Disease`) RETURN 
                    'Disease', n.equivalent_identifiers 
                    LIMIT 50000
                    ").

node_equivalent_identifiers_all(Component, Equivalent_identifiers_All) :- 
                                    node(Component, Equivalent_identifiers), 
                                    Equivalent_identifiers_All = munion(Equivalent_identifiers). % flat all databases in a list and group by component
element_to_database(Component, Equivalent_identifiers_all_distinct) :- 
                                    node_equivalent_identifiers_all(Component, Equivalent_identifiers_All), 
                                    Equivalent_identifiers_all_distinct = collections:distinct(transform(Equivalent_identifiers_All,"x -> element_at(split(x,':'),1)")). % get the database name by cleaning up the equivalent identifier
@output("element_to_database").
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


### Interval Operators

The interval operators allow for checking if a value falls within a specified range. These operators can be used to define conditions with different inclusivity options.

#### `between`
The `between` operator checks if a value is strictly between two other values, excluding the boundaries.

Example:
```prolog
% Check if X is strictly between 5 and 10 (excludes 5 and 10)
range_check(X) :- b(X), Between = between(X, 5, 10), Between == #T.
```

#### `_between` (Left Inclusive)
The `_between` operator checks if a value is between two other values, including the left boundary but excluding the right boundary.

Example:
```prolog
% Check if X is between 5 and 10 (includes 5, excludes 10)
left_inclusive_check(X) :- b(X), Between = _between(X, 5, 10), Between == #T.
```

#### `between_` (Right Inclusive)
The `between_` operator checks if a value is between two other values, excluding the left boundary but including the right boundary.

Example:
```prolog
% Check if X is between 5 and 10 (excludes 5, includes 10)
right_inclusive_check(X) :- b(X), Between = between_(X, 5, 10), Between == #T.
```

#### `_between_` (Left and Right Inclusive)
The `_between_` operator checks if a value is between two other values, including both boundaries.

Example:
```prolog
% Check if X is between 5 and 10 (includes both 5 and 10)
inclusive_check(X) :- b(X), Between = _between_(X, 5, 10), Between == #T.
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

## Embeddings Functions

The embeddings library provides functions for working with vector representations of data, enabling similarity calculations and semantic analysis.

### `embeddings:vectorize`

The `embeddings:vectorize` function converts input arguments into vector embeddings using OpenAI's embedding model. This function takes multiple arguments and returns an array of double values representing the semantic vector.

**Example:**
```prolog
person("Luca","Rossi").

% Convert person data to embeddings
person_embeddings(Vector) :- person(X,Y,Z), Vector = embeddings:vectorize(X,Y).

@output("person_embeddings").
```

### `embeddings:cosine_sim`

The `embeddings:cosine_sim` function calculates the cosine similarity between two embedding vectors. Cosine similarity measures the cosine of the angle between two vectors, providing a value between -1 and 1, where 1 indicates identical vectors and 0 indicates orthogonal vectors.

**Example:**
```prolog
person("Luca","Rossi").
employee("Luca","Red").

% Convert data to embeddings
person_embeddings(Vector) :- person(X,Y,Z), Vector = embeddings:vectorize(X,Y,Z).
employee_embeddings(Vector) :- employee(X,Y,Z), Vector = embeddings:vectorize(X,Y,Z).

% Calculate cosine similarity between embeddings
cosineSim(SimilarityScore) :- 
    employee_embeddings(Vector_1), 
    person_embeddings(Vector_2), 
    SimilarityScore = embeddings:cosine_sim(Vector_1, Vector_2).

@output("cosineSim").
```

**Complete Example with Similarity Analysis:**
This example demonstrates how to use both functions together to analyze semantic similarity between different data representations:

```prolog
% Sample data
person("Luca","Rossi",1993).
employee("Luca","Red",1993).
person("Maria","Bianchi",1985).
employee("Maria","Green",1985).

% Generate embeddings for person data
person_embeddings(Name, Vector) :- 
    person(Name,Surname,Year), 
    Vector = embeddings:vectorize(Name,Surname,Year).

% Generate embeddings for employee data  
employee_embeddings(Name, Vector) :- 
    employee(Name,Color,Year), 
    Vector = embeddings:vectorize(Name,Color,Year).

% Calculate similarity between corresponding person and employee embeddings
similarity_analysis(Name, SimilarityScore) :- 
    person_embeddings(Name, PersonEmbedding),
    employee_embeddings(Name, EmployeeEmbedding),
    SimilarityScore = embeddings:cosine_sim(PersonEmbedding, EmployeeEmbedding).

@output("similarity_analysis").
```

This program will generate embeddings for both person and employee data, then calculate the cosine similarity between corresponding entries to measure how semantically similar the different representations are.

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

For `msum` and `mprod`, the second argument is the list of group-by variables,
and the third argument is the list of contributors.

Finally, all functions besides `msum` and `mprod` take a list of values, called
keys, to be used as a group identifier (i.e. they play the role of group by
variables in standard SQL).

Some aggregate functions cannot be used inside a recursive rule because the
value they return may change in a non-monotonic way when new facts arrive
(e.g., the “winner” of an election can be replaced by a later vote).
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

### LLM Integration

The `llm:generate` function uses LLMs to generate content based on a prompt template and input arguments. This function allows you to create dynamic, AI-generated responses by substituting variables in a prompt with actual values.

**Syntax:**
```prolog
llm:generate(prompt, outputType, arg1, arg2, ..., argN)
```

**Parameters:**
- `prompt`: A string template containing placeholders like `${arg_1}`, `${arg_2}`, etc.
- `outputType`: The expected return type (string, int, double, float, boolean, or list variants)
- `arg1, arg2, ..., argN`: Arguments that will substitute the placeholders in the prompt

**Supported Output Types:**
- `string`, `int`, `double`, `boolean`
- `list<string>`, `list<int>`, `list<double>`, `list<float>`, `list<boolean>`

**Example:**
```prolog
% Sample data: characters from a fantasy world
character("Gandalf", "Wizard", "Middle-earth").
character("Aragorn", "Ranger", "Gondor").
character("Legolas", "Elf", "Mirkwood").
character("Gimli", "Dwarf", "Moria").

% Generate epic battle descriptions using LLM
epic_battle_description(CharName, CharClass, BattleScene) :- 
    character(CharName, CharClass, Realm),
    BattleScene = llm:generate(
        "Create an epic battle scene where ${arg_1}, a legendary ${arg_2} from ${arg_3}, faces off against a powerful enemy. Make it dramatic and heroic, max 2 sentences.",
        "string",
        CharName, CharClass, Realm
    ).

% Generate character backstory using LLM
character_backstory(CharName, Backstory) :- 
    character(CharName, CharClass, Realm),
    Backstory = llm:generate(
        "Write a compelling origin story for ${arg_1}, a ${arg_2} from ${arg_3}. Focus on their greatest achievement and deepest secret. Max 3 sentences.",
        "string",
        CharName, CharClass, Realm
    ).

@output("epic_battle_description").
@output("character_backstory").
```

**How it works:**
1. The prompt template contains placeholders `${arg_1}`, `${arg_2}`, etc.
2. The function substitutes these placeholders with the provided arguments
3. The LLM processes the completed prompt and generates a response
4. The response is cast to the specified output type

**Prompt Template Examples:**
- `"Generate a summary for ${arg_1}":` - Single argument substitution
- `"Compare ${arg_1} and ${arg_2}":` - Multiple argument substitution
- `"Analyze the relationship between ${arg_1}, ${arg_2}, and ${arg_3}":` - Complex multi-argument prompts

This function is particularly useful for:
- Dynamic content generation
- Natural language processing tasks
- AI-powered data transformation
- Creative text generation based on structured data
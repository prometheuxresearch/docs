---
slug: /learn/vadalog/expressions/operators
---

# Operators

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


## Comparison operators

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

## Arithmetic operators

The arithmetic operators are `*` (multiplication), `/` (division), `+`
(addition), `-` (subtraction). Infix `*`, `/`, `+`, `-` can be applied to all
numeric (integer and double) operands, with an implicit upcast to double if any
double is involved.

The operator `+` (plus) also performs string concatenation with an implicit
upcast to string if any string is involved.

The operator `-` (minus) also exists in its monadic version, which simply
inverts the sign of a numeric value.

Division by 0 always fails, causing the program to abort.

Operations associate to the left, except that multiplication and division
operators have higher precedence than addition and subtraction operators.

Precedence can be altered with parentheses.

## Boolean operators

The Boolean operators are and (`&&`), or (`||`) or `not`. They can be used to
combine Boolean data types.


## Logical operators

Vadalog supports a comprehensive set of logical operators that allow for combining and manipulating Boolean expressions. These operators can be used to evaluate complex logical conditions and can be assigned to variables for further processing.

### `and(args)`
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

### `or(args)`
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

### `not(expression)`
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

### `xor(expression1, expression2)`
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

### `nand(expression1, expression2)`
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

### `nor(expression1, expression2)`
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

### `xnor(expression1, expression2)`
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

### `implies(expression1, expression2)`
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

### `iff(expression1, expression2)`
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

### `if(condition, true_value, false_value)`
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

## String operators

The String operators are `substring`, `contains`, `starts_with`, `ends_with`, `concat`, `+`, `index_of`, `string_length`, `to_lower`, `to_upper`, and `split`. These operators allow manipulation and comparison of `String` values.

### `substring`
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

### `starts_with`
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

### `ends_with`
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

### `concat`
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

### `string_length`
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

### `to_lower`
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

### `to_upper`
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

### `split`
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

### `index_of`
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


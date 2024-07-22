# Concepts

At the core of your ontology is a set of rules.

A rule is an expression of the form `h :- b1, … , bn.`, where

- The symbol `:-` can be read as "is derived by",
- The part that comes before `:-`, the `h`, is known as the **head**,
- And the part after, `b1, … , bn`, is known as the **body**.
- All rules must be terminated with a period (`.`).

Both the head and body of a rule are expressed in the form `r(t1, t2, … , tn)` which are known as **atoms**. `r` is the **predicate** of the atom, and `t1, t2, …, tn` are its **terms**.

Predicates can be thought of as a general statements that can be true or false for different values.

The terms of an atom is an ordered list of any [constant](#data-types), [variable](#variables), or [labelled null](#labelled-nulls).

You can think of predicates as general statements that can be true or false for different values. It's like a template. For example, `student(X)` is the predicate `student`, where X can be any name.

An atom is said to be **ground** if it only contains constants. A ground atom is
also known as **fact**, and is always true. Thus `student("Plato")` is the fact
that Plato is indeed a student.

## Rules and programs

A rule is a way to derive new facts from existing ones. It says that if certain conditions of a predicate are true, then another predicate must also be true.

```
a(X) :- b(X).
```

This rule generates facts for atom `a`, given facts for atom `b`. `X` is a
variable, which represents a generalization of a fact. Thus, for every value `X`
for which `b` is true, `a(X)` is also true.

Consider this next rule:

```
c(X,Z) :- a(X,Y), b(Y,Z).
```

For every two facts `a` and `b`, where the facts are joined by some common term,
`Y`, a third fact, `c` can be derived. An example of this might exist in family trees:

```
is_nephew(Person, Child) :- is_sibling(Person, Sibling),
                            is_son(Sibling, Child).
```

A **Vadalog (logic) program (or ontology)** is a set P of rules and facts.

The following is an example that shows a simple Vadalog program.

```prolog showLineNumbers
a(1).
c(1,2).
b(Y,X) :- a(X), c(X,Y).
@output("b").
```

`a(1)` is a fact, `b(Y,X) :- a(X),c(X,Y)` is a rule. Observe that `@output("b")`
is an annotation and specifies that the facts for `b` are in the output. We will take a look at [annotations](./annotations) later.

When a rule's head predicate can be successfully derived by all variables of the body, we say that it has been **activated**.

## Comments

Line comments in Vadalog program are denoted by `%`. The syntax is then the
following:

```prolog
% this is a comment
```

## Data types

The table below shows the data types supported by Vadalog, along with the
literals for the respective constants.

| Data type | Examples of constant literals             |
| --------- | ----------------------------------------- |
| string    | `"string literal"`, `"a string"`, `""`    |
| integer   | `1`, `3`, `5`, `-2`, `0`                  |
| double    | `1.22`, `1.0`, `-2.3`, `0.0`              |
| date      | `2012-10-20`, `2013-09-19 11:10:00`       |
| boolean   | `#T`, `#F`                                |
| set       | `{1}`, `{1,2}`, `{}`, `{"a"}`, `{2.0,30}` |
| list      | `[1]`, `[1,2]`, `[]`, `["a"]`, `[2.0,30]` |
| unknown   | `/`                                       |

## Variables

Variables have different interpretations in different programming paradigms. In
imperative languages, they are essentially memory locations that may have some
contents and the contents may change over time.

In algebra or physics, a variable represents a concrete value and its function
is somewhat similar to a pronoun in natural language. If we were to replace such
variables with actual concrete values, we will have concrete statements
represnding concerete relations between arithmetic expressions.

Variables in Vadalog are more like variables in algebra than like those of
imperative programming languages--they are more like variables in first-order logic.

For example, consider the following statements:

- "Every father X is a man"
- "For any man X there exists a father Y"

These statements can be true or false depending on how we choose to
**instantiate** X and Y, which means, what specific concrete values we choose.

In the first statement, if were to consider every human father, then the
statement is true.

```
man(X) :- father(X, Y).
```

However, if X were to take the value of the male parent of a pet dog Fluffy,
then it will be false.

If a variable appears in the head, but not in the body, then **there exists** at
least one value of the variable that makes the head true. Thus for our second
statement, if there exists one `X`, namely "Luke Skywalker", who has a father,
Y, then our statement would be true.

```
father(X, Y) :- father("Luke Skywalker", Y).
```

:::note
A Vadalog variable is **local** to the rule in which it
occurs. This means that occurrences of the same variable name in different rules
refer to different variables.
:::

It follows, naturally, that variables cannot occur in facts.

A variable such as `X` is just a _placeholder_. In order to use it in a
computation, we must instantiate it, i.e., replace it with a concrete value. The
value is called the _instantiation_ or [**binding**](./annotations#bind).

In general, a bound variable should be **positively bound**, i.e., it should
have a binding occurrence that is not in the scope of a [negation](./expressions-operators#negation).

:::note
Variables in vadalog need to be capitalized, and can contain
underscores.
:::

## Anonymous Variables

To ignore certain predicates in a rule body, we can use anonymous variables
with the underscore symbol (`_`). Such as in the following example:

```prolog showLineNumbers {3}
t("Text", 1, 2).
t("Text2", 1, 2).
b(X) :- t(X, _, _).
@output("b").
```

Here, `b(X)` is derivable for all values of `X` for predicate `t`, regardless of the values of `t`'s 2nd and 3rd terms. The expected output are the two facts:

```
b("Text").
b("Text2").
```

## Labelled Nulls

All nulls that occur during the execution of a vadalog program are **labelled**.
It represents a unique identifier for an unknown value. Labelled nulls are
produced as a result of:

1. nulls in the data sources (unless the data source supports labelled nulls, all
   of them are assumed to have different identifiers);
2. variables that exist in the head but not the body.

The type of a labelled null is always unknown.

The following two examples show possible uses of labelled nulls. Many more are
indeed possible and important in ontological reasoning.

```prolog showLineNumbers {3}
employee(1).
employee(2).
manager(Y,X) :- employee(X).
@output("manager").
```

This ontology represents that every employee has a manager. The expected result
is:

```
manager(y1,1).
manager(y2,2).
```

where `y1` and `y2` are labelled nulls, representing that there must be a manager
for each of the two employees. We cannot know from this program alone, if they
are the same person or not, but there exists the possibility that they are
different people.

```prolog showLineNumbers {7}
employee("Jack").
contract("Jack").
employee("Ruth").
contract("Ruth").
employee("Ann").

manager(Y,X) :- employee(X).
hired(Y,X) :- manager(Y,X), contract(X).
contractSigned(X) :- hired(Y,X), manager(Y,Z).
@output("contractSigned").
```

This example expresses a simple ontology stating, on line 7, that every employee
X has a manager Y.

If the manager Y sees that there is a pending contract for
the respective employee X, then she hires the employee. Once a manager Y has hired an employee X, the respective contract X is signed.

If someone has been hired for some reason by an employee who is not a manager,
then the contract will not be signed. The expected result is:

```prolog
contractSigned("Jack").
contractSigned("Ruth").
```

Observe that the name of the manager is unknown throughout the entire processing.

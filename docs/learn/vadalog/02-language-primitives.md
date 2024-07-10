# Primitives

## Preliminaries

Let _C_, _V_, _N_ be sets of **constants**, **variables** or **marked nulls**,
respectively.

The elements of such sets are known as **terms**. A syntactic expression of the
form `r(t1, t2, …, tn)` is known as **atom**, where `t1, t2, …, tn` are terms.

An
atom is said to be **ground** if it only contains constants. A ground atom is
also known as **fact**.

## Rules and programs

A rule is an expression of the form `h :- b1, … , bn` where `b1, … , bn` are the
atoms of the _body_ and `h` is the atom of the _head_.

The variables in the body are universally quantified, while the variables that
appear in the head, but not in the body are existentially quantified.

A successful assignment of all the variables of the body of a rule results in a
derivation for the rule head predicate, which is a successful activation of the
rule. Vadalog programs use the set semantics, defined in a standard way in
presence of existential quantification by the _chase procedure_.

Let us present some examples of rules.

```
a(X) :- b(X).
```

It generates facts for atom `a`, given facts for atom `b`. `X` is a variable.

```
a(X,Z) :- b(X,Y), c(Y,Z).
```

```
a(X,Z) :- a(X,Y), a(Y,Z).
```

Given two facts for `a`, it generates a third one.

A **Vadalog (logic) program (or ontology)** is a set P of rules and facts.

The following is an example shows a simple Vadalog program.

```prolog showLineNumbers
a(1).
c(1,2).
b(Y,X) :- a(X), c(X,Y).
@output("b").
```

`a(1)` is a fact, `b(Y,X) :- a(X),c(X,Y)` is a rule. Observe that `@output("b")`
is an annotation and specifies that the facts for b are in the output.

## Data types

The table below shows the data types supported by Vadalog, along with the
literals for the respective constants.

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

Line comments in Vadalog program are denoted by `%`. The syntax is then the
following:

```prolog
% this is a comment
```

## Variables

Variables have different interpretations in different programming paradigms. In
imperative languages, they are essentially memory locations that may have some
contents and the contents may change over time.

In algebra or physics, a variable represents a concrete value and its function
is somewhat similar to a pronoun in natural language. In effects, once we
replace variables with concrete actual values, we have relations between
concrete arithmetic expressions.

Variables in Vadalog are more like variables in algebra than like those of
imperative programming languages.

Specifically, a good interpretation is the following.

**Variables in Vadalog are like variables in first-order logic**.

For example, consider the following statements:

- "For any man X there exists a father Y"
- "Every father X is a man"

These statements can be true or false depending on how we choose to instantiate
X and Y, which means, what specific concrete values we choose. There are
quantifiers "for any", "every" (or "for all"), namely universal quantification,
and "there exists", namely existential quantification.

It should be noted that a Vadalog variable is **local** to the rule in which it
occurs. This means that occurrences of the same variable name in different rules
refer to different variables.

Variables cannot occur in facts.

A variable such as X is just a _placeholder_. In order to use it in a
computation, we must instantiate it, i.e., replace it with a concrete value. The
value is called the _instantiation_ or **binding**.

There are several ways in which a Vadalog variable can be instantiated.

If the variable occurs in an atom in the body of a rule, the variable can then
become instantiated to a value derived from the values in the predicate.

In general, a bound variable should be **positively bound**, i.e., it should
have a binding occurrence that is not in the scope of a negation.

_Note on syntax_: Variables in vadalog need to be capitalized, and can contain
underscores.

## Anonymous Variables

To ignore certain predicates in a rule body, one can use anonymous variables
using the underscore symbol. Such as in the following example:

```prolog showLineNumbers {3}
t("Text", 1, 2).
t("Text2", 1, 2).
b(X) :- t(X, _, _).
@output("b").
```

## Marked Nulls

A marked null represents an identifier for an unknown value. Marked nulls are
produced as a result of:

1. nulls in the data sources (unless the data source supports marked nulls, all
   of them are assumed to have different identifiers);
2. existential quantification.

The type of a marked null is always unknown.

The following two examples show possible uses of marked nulls. Many more are
indeed possible and important in ontological reasoning.

```prolog showLineNumbers {3}
employee(1).
employee(2).
manager(Y,X) :- employee(X).
@output("manager").
```

This ontology represents that every employee has a manager. The expected result
is:

```prolog
manager(z1,1).
manager(z2,2).
```

where `z1` and `z2` are marked nulls, representing that there must be a manager
for each of the employees, but their identity is unknown.

```prolog showLineNumbers
employee("Jack").
contract("Jack").
employee("Ruth").
contract("Ruth").
employee("Ann").
hired("Ann","Ruth").
manager(Y,X) :- employee(X).
hired(Y,X) :- manager(Y,X),contract(X).
contractSigned(X) :- hired(Y,X),manager(Y,Z).
@output("contractSigned").
```

This example expresses a simple ontology stating, on line 7, that every employee
X has a manager Y. If the manager Y sees that there is a pending contract for
the respective employee X, then he hires the employee.

Once a manager Y has hired an employee X, the respective contract X is signed.
If someone has been hired for some reason by an employee who is not a manager,
then the contract will not be signed. Observe that the name of the manager is
unknown throughout the entire processing. The expected result is:

```prolog
contractSigned("Jack").
contractSigned("Ruth").
```

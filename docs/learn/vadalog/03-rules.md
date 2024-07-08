# Rules

## Linear rules

_Linear rules_ are rules with one single atom in the body. They define facts of the head
predicate, given facts of the single body predicate.

```prolog showLineNumbers {3}
employee(1).
employee(2).
department(Y,X) :- employee(X).
@output("department").
```

For each employee X there exists a department Y.
The expected result is:

```prolog
department(z1,1).
department(z2,2).
```

## Facts

The simplest form of linear rule is a **fact**: a ground head-less linear rule.

```prolog showLineNumbers
employee("Jack").
employee("Ruth").
```

## Join rules

_Join rules_ are rules with multiple atoms in the body. They basically define facts of the
head predicate, given facts of the body.

```prolog
project(Z,X) :- employee(X), department(Y,X).
```

For each employee X in a department Y, there exists a project Z in which he participates.

If the atoms in the body do not have variables in common, the Cartesian product
is assumed.

```prolog showLineNumbers {5}
employee("Jack").
employee("Ruth").
department("science").
department("finance").
canWork(X,Y,Z) :- employee(X), department(Y).
@output("canWork").
```

Any employee X can work in any department Y on some unknown project Z. The expected result is:

```prolog
canWork("Jack","science",z1).
canWork("Jack","finance",z2).
canWork("Ruth","science",z3).
canWork("Ruth","finance",z4).
```

## Constants within rules

Constants can appear in the atoms of the rules.

When they appear in the head, they denote specific constant values to be generated in the head facts.

When they appear in the body, they denote specific filters, or selection criteria,
to be applied to the facts considered in the rule.

```prolog showLineNumbers {3}
employee("Mark").
junior("Mark").
contract(X,"basic",20) :- employee(X),junior(X).
@output("contract").
```

A junior employee will have a "basic" contract, with stipend 20. The expected result is:

```
contract("Mark","basic",20).
```

For this next example:

```prolog showLineNumbers {3,4}
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

The expected result is:

```prolog
contract("Mark","basic",20).
contract("Ruth","advanced",40).
```

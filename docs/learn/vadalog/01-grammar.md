# Vadalog Grammar Reference

This document provides a comprehensive reference for the Vadalog grammar, covering all syntax rules, operators, and language constructs.

---

## Program Structure

A Vadalog program consists of a sequence of clauses:

```prolog
program: (clause)*
```

### Clause Types

A clause can be one of three types:

```prolog
clause: annotation | fact | rule
```

1. **Annotation**: Configuration directives (e.g., `@bind`, `@output`)
2. **Fact**: Ground truth statements (e.g., `person("john", 25).`)
3. **Rule**: Logical inference rules (e.g., `adult(X) :- person(X, Age), Age >= 18.`)

---

## Facts

Facts are ground statements that establish base knowledge:

```prolog
fact: annotationBody* atom '.'
```

**Examples:**
```prolog
person("alice", 30).
employee("bob", "engineering", 75000).
company("acme", "technology").
```

---

## Rules

Rules define logical inference patterns:

```prolog
rule: annotationBody* head ':-' body '.'
```

### Rule Head

The head can be:
- **Regular atom**: `result(X, Y)`
- **EGD (Equality Generating Dependency)**: `X = Y`
- **False head**: `#F` (for constraints)

```prolog
head: atom (',' atom)* | egdHead | falseHead
```

**Examples:**
```prolog
% Regular head
adult_customer(Name) :- customer(Name, Age), Age >= 18.

% Multiple heads
high_value(Name), vip(Name) :- customer(Name, _, Balance), Balance > 10000.

% EGD head
X = Y :- person(X, Age1), person(Y, Age2), Age1 = Age2.

% Constraint (false head)
#F :- employee(Name, Dept), Dept = "invalid".
```

### Rule Body

The body consists of literals, conditions, and functions:

```prolog
body: (literal | condition | function) (',' (literal | condition))*
```

---

## Literals

Literals can be positive, negative, or domain predicates:

```prolog
literal: atom          # Positive literal
       | 'not' atom    # Negative literal  
       | 'dom(*)'      # Domain literal
```

**Examples:**
```prolog
% Positive literal
employee(Name, Dept) :- person(Name), works_in(Name, Dept).

% Negative literal
available(Name) :- employee(Name), not on_vacation(Name).

% Domain literal
all_values(X) :- dom(*), X = value.
```

---

## Conditions

Conditions define constraints and comparisons:

### Comparison Operators

```prolog
gtCondition: varTerm GT expression     % >
ltCondition: varTerm LT expression     % <
geCondition: varTerm GE expression     % >=
leCondition: varTerm LE expression     % <=
eqCondition: varTerm EQ expression     % =
eqeqCondition: varTerm EQEQ expression % ==
neqCondition: varTerm NEQ expression   % != or <>
```

### Set Membership

```prolog
inCondition: varTerm IN expression      % in
notInCondition: varTerm NOTIN expression % !in
```

**Examples:**
```prolog
high_salary(Name) :- employee(Name, Salary), Salary > 100000.
young_adult(Name) :- person(Name, Age), Age >= 18, Age < 30.
tech_employee(Name) :- employee(Name, Dept), Dept == "technology".
valid_dept(Name) :- employee(Name, Dept), Dept in {"engineering", "sales", "marketing"}.
```

---

## Expressions

Expressions support arithmetic, logical, and functional operations:

### Arithmetic Expressions

```prolog
expression PLUS expression    % +
expression MINUS expression   % -
expression PROD expression    % *
expression DIV expression     % /
MINUS expression             % unary minus
```

### Logical Expressions

```prolog
expression AND expression     % &&
expression OR expression      % ||
NOT expression               % !
```

### Set Operations

```prolog
expression UNION expression        % |
expression INTERSECTION expression % &
```

### Comparison Expressions

```prolog
expression LT expression      % <
expression LE expression      % <=
expression GT expression      % >
expression GE expression      % >=
expression EQEQ expression    % ==
expression NEQ expression     % !=
```

**Examples:**
```prolog
total_compensation(Name, Total) :- 
    employee(Name, Salary, Bonus), 
    Total = Salary + Bonus.

senior_employee(Name) :- 
    employee(Name, Years), 
    Years >= 5.

department_union(Dept) :- 
    engineering_dept(Dept) | sales_dept(Dept).
```

---

## Aggregation Functions

Vadalog supports both monotonic and non-monotonic aggregations:

### Monotonic Aggregations

```prolog
msum(expression, varList?)     % Incremental sum
mprod(expression, varList?)    % Incremental product
mcount(expression?, varList?)  % Incremental count
munion(expression, varList?)   % Incremental union
mmax(expression)               % Incremental maximum
mmin(expression)               % Incremental minimum
mavg(expression)               % Incremental average
```

### Standard Aggregations

```prolog
sum(expression)                % Sum
prod(expression)               % Product
avg(expression)                % Average
count(expression, varList?)    % Count
min(expression)                % Minimum
max(expression)                % Maximum
maxcount(expression?)          % Maximum count
```

**Examples:**
```prolog
% Calculate total salary by department (Dept is the group-by variable)
dept_total(Dept, Total) :- 
    employee(Name, Dept, Salary), 
    Total = msum(Salary).

% Average age by department (Dept appears in both head and body for grouping)
dept_avg_age(Dept, AvgAge) :- 
    employee(Name, Dept, Age), 
    AvgAge = mavg(Age).

% Count employees per department (Dept is the grouping variable)
dept_count(Dept, Count) :- 
    employee(Name, Dept), 
    Count = mcount().

% Global aggregation (no group-by variables in head)
total_employees(Count) :- 
    employee(Name, _, _), 
    Count = mcount().

% IMPORTANT: Group-by variables appear in the head AND body
% The aggregation function takes ONLY the expression to aggregate
% ❌ WRONG: mavg(Age, [Dept]) 
% ✅ CORRECT: avg_age(Dept, Avg) :- employee(_, Dept, Age), Avg = mavg(Age).
```

---

## String Operations

Comprehensive string manipulation functions:

```prolog
substring(string, start, length?)  % Extract substring
contains(string, substring)        % Check if contains
starts_with(string, prefix)        % Check if starts with
ends_with(string, suffix)          % Check if ends with
concat(str1, str2, ...)           % Concatenate strings
concat_ws(separator, str1, str2, ...) % Concatenate with separator
string_length(string)              % Get string length
is_empty(string)                   % Check if empty
to_lower(string)                   % Convert to lowercase
to_upper(string)                   % Convert to uppercase
split(string, delimiter)           % Split string
index_of(string, substring)        % Find substring index
replace(string, old, new)          % Replace substring
join(array, separator)             % Join array elements
```

**Examples:**
```prolog
full_name(FullName) :- 
    person(FirstName, LastName), 
    FullName = concat(FirstName, " ", LastName).

email_domain(Domain) :- 
    user(Email), 
    Parts = split(Email, "@"), 
    Domain = collections:get(Parts, 2).
```

---

## Logical Operations

Advanced logical operators beyond basic boolean logic:

```prolog
and(expr1, expr2, ...)     % Logical AND
or(expr1, expr2, ...)      % Logical OR
not(expression)            % Logical NOT
xor(expr1, expr2)          % Exclusive OR
nand(expr1, expr2)         % NOT AND
nor(expr1, expr2)          % NOT OR
xnor(expr1, expr2)         % NOT XOR
implies(expr1, expr2)      % Implication
iff(expr1, expr2)          % If and only if
if(condition, then, else)  % Conditional expression
```

---

## Interval Operations

Check if values fall within ranges with different inclusivity:

```prolog
between(value, min, max)    % Exclusive bounds
_between(value, min, max)   % Left inclusive
between_(value, min, max)   % Right inclusive  
_between_(value, min, max)  % Both inclusive
```

**Examples:**
```prolog
young_adult(Name) :- 
    person(Name, Age), 
    _between_(Age, 18, 25).

working_hours(Hour) :- 
    time_entry(Hour), 
    _between_(Hour, 9, 17).
```

---

## Data Type Conversions

Convert between different data types:

```prolog
as_string(expression)              % Convert to string
as_double(expression)              % Convert to double
as_int(expression)                 % Convert to integer
as_long(expression)                % Convert to long
as_float(expression)               % Convert to float
as_boolean(expression)             % Convert to boolean
as_list(expression, expression)    % Convert to list
as_set(expression, expression)     % Convert to set
as_map(key, value, expression)     % Convert to map
as_date(expression)                % Convert to date
as_timestamp(expression)           % Convert to timestamp
as_json(expression)                % Convert to JSON
```

---

## Null Handling

Handle null values explicitly:

```prolog
is_null(expression)        % Check if null
is_not_null(expression)    % Check if not null
```

---

## Terms and Constants

### Variable Terms
- **Variables**: Start with uppercase (`Name`, `Age`, `X`)
- **Anonymous variables**: Start with underscore (`_`, `_1`, `_temp`)

### Constant Terms
- **Strings**: Double-quoted (`"hello"`, `"john doe"`)
- **Integers**: Numeric (`42`, `-10`)
- **Doubles**: Decimal (`3.14`, `-2.5`)
- **Booleans**: `#T` (true), `#F` (false)
- **Dates**: `2024-01-15` or `2024-01-15 14:30:00`

### Collection Terms
- **Lists**: `[1, 2, 3]` or `["a", "b", "c"]`
- **Sets**: `{1, 2, 3}` or `{"a", "b", "c"}`
- **Empty collections**: `[]` (list), `{}` (set)

---

## External Functions

Call external functions using namespace syntax:

```prolog
functionCall: ID('(' (expression (',' expression)*)? ')')
```

**Examples:**
```prolog
% Math functions
sqrt_value(Result) :- number(X), Result = math:sqrt(X).

% Date functions  
tomorrow(Date) :- today(Today), Date = date:next_day(Today).

% Hash functions
user_hash(Hash) :- user(Data), Hash = hash:sha1(Data).
```

---

## Parameter Operations

Dynamic parameter substitution:

```prolog
paramOperation: '${' paramTerm '}'
```

**Example:**
```prolog
filtered_data(X) :- data(X, Value), Value > ${threshold}.
```

---

## Comments

Line comments start with `%`:

```prolog
% This is a comment
person("alice", 30).  % End-of-line comment
```

---

## Operator Precedence

From highest to lowest precedence:
1. **Parentheses**: `()`
2. **Unary minus**: `-`
3. **Multiplication/Division**: `*`, `/`
4. **Addition/Subtraction**: `+`, `-`
5. **Comparison**: `<`, `<=`, `>`, `>=`, `==`, `!=`
6. **Logical NOT**: `!`
7. **Logical AND**: `&&`
8. **Logical OR**: `||`
9. **Set operations**: `|`, `&`

---

## Best Practices

1. **Use meaningful predicate names**: `customer_analysis` not `ca`
2. **Follow naming conventions**: Variables uppercase, constants lowercase
3. **Group related rules**: Keep similar logic together
4. **Comment complex logic**: Explain non-obvious rules
5. **Use proper aggregations**: `mavg()` for averages, `msum()` for sums
6. **Handle edge cases**: Consider null values and empty results

This grammar reference provides the foundation for writing correct, efficient Vadalog programs. 
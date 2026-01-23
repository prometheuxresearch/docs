---
slug: /learn/vadalog/sql-integration
---

# SQL Integration in Vadalog

## Why SQL in Vadalog?

Prometheux supports **native SQL queries** embedded directly within Vadalog rules. This powerful feature allows you to:

- **Leverage existing SQL skills** – write familiar SQL SELECT statements alongside Vadalog rules
- **Use SQL's expressive power** – complex JOINs, aggregations, window functions, and CTEs
- **Query across data sources** – seamlessly combine PostgreSQL, MariaDB, CSV files, and in-memory facts in a single SQL query
- **Scale to large datasets** – benefit from distributed query execution for large-scale data processing
- **Simplify data transformation** – use SQL for data manipulation while keeping Vadalog for logical reasoning

Prometheux automatically parallelizes and optimizes SQL queries across distributed compute resources while maintaining the declarative semantics of your program.

---

## Two Ways to Use SQL

### 1. SQL in Rule Bodies (Simple Approach)

You can replace the traditional Vadalog body with a SQL `SELECT` statement using the `<-` operator:

```prolog
result_predicate() <- SELECT column1, column2 FROM table WHERE condition.
```

**Syntax:**
- Use `<-` instead of `:-` to indicate a SQL body
- The SQL query starts with `SELECT` and ends with `.` (the rule terminator)
- **No arguments needed in the head** – the output schema is defined by the SELECT clause

**Simple Example:**
```prolog
% Define some facts
person("Alice", 25).
person("Bob", 30).
person("Charlie", 20).

% SQL rule - empty parentheses in head
adults() <- SELECT person_0 as name, person_1 as age 
            FROM person 
            WHERE person_1 >= 25.

@output("adults").
```

**Output:**
```
adults("Alice", 25)
adults("Bob", 30)
```

**CSV Example:**
```prolog
@bind("employees", "csv useHeaders=true", "data", "employees.csv").

% Filter employees using SQL
high_earners() <- SELECT name, salary 
                  FROM employees 
                  WHERE salary > 100000.

@output("high_earners").
```

### 2. SQL in Functions (Advanced)

You can pass SQL queries as **string arguments** to graph analytics functions. This is useful when you want to filter or transform data before applying graph algorithms.

**Syntax:**
- Wrap the SQL query in double quotes: `"SELECT ..."`
- The SQL query replaces the predicate atom normally passed to the function
- **Head arguments ARE required** – they receive the function's output
- All function options still work (e.g., `"visited=true"`, `"max_depth=5"`)

**Example:**
```prolog
edge(1, 2).
edge(2, 3).
edge(3, 4).

% Traditional approach - pass predicate atom
tc_traditional(X, Y) :- #TC(edge).

% SQL approach - pass SQL query as string
tc_sql(X, Y) :- #TC("SELECT edge_0, edge_1 FROM edge WHERE edge_0 < 3").

@output("tc_sql").
```

:::important Head Arguments
- **SQL in rule bodies**: Head arguments are **optional** (empty parentheses `()` work)
- **SQL in functions**: Head arguments are **required** (e.g., `(X, Y)`) to capture function output
:::

The difference is that functions like `#TC` compute results (transitive closure) and assign them to variables, while SQL bodies directly define the output.

---

## Column Naming Conventions

Vadalog uses specific column naming conventions depending on the data source and query type.

### For In-Memory Facts

Facts use the pattern `predicateName_columnIndex` (zero-based):

```prolog
person("Alice", 30, "Engineer").
person("Bob", 25, "Designer").

% Columns: person_0, person_1, person_2
adults() <- SELECT person_0 as name, person_1 as age 
            FROM person 
            WHERE person_1 >= 18.
```

### For CSV/Parquet with Headers

**Single-table queries** can use actual column names:

```prolog
@bind("employees", "csv useHeaders=true", "data", "employees.csv").

% Use actual column names (name, age, salary)
high_earners() <- SELECT name, salary 
                  FROM employees 
                  WHERE salary > 100000.
```

**Multi-table queries** must use `predicateName_columnIndex`:

```prolog
@bind("employees", "csv useHeaders=true", "data", "employees.csv").
@bind("departments", "csv useHeaders=true", "data", "departments.csv").

% MUST use predicateName_columnIndex for JOINs
emp_dept() <- SELECT employees_1, departments_1 
              FROM employees 
              JOIN departments ON employees_2 = departments_0.
```

### For Database Tables (PostgreSQL, MariaDB, etc.)

**Single-table queries** can use actual database column names:

```prolog
@bind("employees", "postgresql", "company_db", "employees").

% Use actual database column names
high_earners() <- SELECT name, salary 
                  FROM employees 
                  WHERE salary > 100000.
```

**Multi-table queries** must use `predicateName_columnIndex`:

```prolog
@bind("employees", "postgresql", "company_db", "employees").
@bind("departments", "postgresql", "company_db", "departments").

% MUST use predicateName_columnIndex for JOINs
% employees_0 (id), employees_1 (name), employees_2 (dept_id), employees_3 (salary)
% departments_0 (dept_id), departments_1 (dept_name), departments_2 (location)
emp_dept() <- SELECT employees_1, employees_3, departments_1 
              FROM employees 
              JOIN departments ON employees_2 = departments_0.
```

:::tip Column Naming Rule
- **Single table** → Use actual column names (CSV headers or DB column names)
- **Multiple tables** → Use `predicateName_columnIndex` for all tables
:::

---

## Examples

### Example 1: Basic SQL Body with Facts

```prolog
person("Alice", 25).
person("Bob", 30).
person("Charlie", 20).

% Use default column names for facts
adults() <- SELECT person_0 as name, person_1 as age 
            FROM person 
            WHERE person_1 >= 25.

@output("adults").
```

**Output:**
```
adults("Alice", 25)
adults("Bob", 30)
```

### Example 2: SQL Body with CSV Files

```prolog
@bind("employees", "csv useHeaders=true", "data", "employees.csv").

% Single table - use actual column names
high_earners() <- SELECT name, salary 
                  FROM employees 
                  WHERE salary > 70000.

@output("high_earners").
```

### Example 3: Multi-Table JOIN with CSVs

```prolog
@bind("employees", "csv useHeaders=true", "data", "employees.csv").
@bind("departments", "csv useHeaders=true", "data", "departments.csv").

% Multi-table - use predicateName_columnIndex
emp_dept() <- SELECT employees_1 as emp_name, 
                     departments_1 as dept_name, 
                     departments_2 as location
              FROM employees 
              JOIN departments ON employees_2 = departments_0.

@output("emp_dept").
```

### Example 4: Mixing Facts and CSV

```prolog
@bind("departments", "csv useHeaders=true", "data", "departments.csv").

employees(1, "Alice", 100, 75000).
employees(2, "Bob", 200, 65000).
employees(3, "Charlie", 100, 80000).

% Multi-source - use predicateName_columnIndex
emp_with_dept() <- SELECT employees_1, employees_3, departments_1 
                   FROM employees 
                   JOIN departments ON employees_2 = departments_0.

@output("emp_with_dept").
```

### Example 5: SQL Aggregation

```prolog
@bind("employees", "csv useHeaders=true", "data", "employees.csv").
@bind("departments", "csv useHeaders=true", "data", "departments.csv").

dept_stats() <- SELECT departments_1 as dept_name,
                       COUNT(*) as emp_count,
                       SUM(employees_3) as total_salary,
                       AVG(employees_3) as avg_salary
                FROM employees 
                JOIN departments ON employees_2 = departments_0 
                GROUP BY departments_1.

@output("dept_stats").
```

### Example 6: SQL with UNION

```prolog
us_employees("Alice", "USA").
us_employees("Bob", "USA").

uk_employees("Charlie", "UK").
uk_employees("Diana", "UK").

all_employees() <- SELECT us_employees_0 as name, us_employees_1 as country 
                   FROM us_employees 
                   UNION 
                   SELECT uk_employees_0 as name, uk_employees_1 as country 
                   FROM uk_employees.

@output("all_employees").
```

### Example 7: Cross-Database Queries (PostgreSQL + MariaDB)

```prolog
@bind("employees", "postgresql", "company_db", "employees").
@bind("orders", "mariadb", "sales_db", "orders").

% Join across PostgreSQL and MariaDB
employee_orders() <- SELECT employees_1, orders_1, orders_2 
                     FROM employees 
                     JOIN orders ON employees_1 = orders_3.

@output("employee_orders").
```

### Example 8: Hybrid Queries (PostgreSQL + CSV + Facts)

```prolog
@bind("pg_departments", "postgresql", "company_db", "departments").
@bind("csv_employees", "csv useHeaders=true", "data", "employees.csv").

budgets(100, 500000).
budgets(200, 300000).

% Three-way join across different sources
dept_budget() <- SELECT pg_departments_1 as dept_name,
                        csv_employees_1 as employee_name,
                        budgets_1 as budget
                 FROM pg_departments 
                 JOIN csv_employees ON pg_departments_0 = csv_employees_2
                 JOIN budgets ON pg_departments_0 = budgets_0.

@output("dept_budget").
```

---

## SQL in Graph Functions

All graph analytics functions (`#TC`, `#ASP`, `#PATHS`, `#CC`, etc.) can accept SQL queries instead of predicate atoms.

### Example 9: Transitive Closure with SQL

```prolog
edge(1, 2).
edge(2, 3).
edge(3, 4).

% Compute transitive closure using SQL
tc(X, Y) :- #TC("SELECT edge_0, edge_1 FROM edge").

@output("tc").
```

**Result:**  
All reachable pairs including transitive paths (1→2, 2→3, 3→4, 1→3, 2→4, 1→4)

### Example 10: All-Shortest Paths with SQL

```prolog
edge(1, 2, 10).
edge(2, 3, 20).
edge(3, 4, 15).

% Compute shortest paths using SQL
asp(X, Y, Dist) :- #ASP("SELECT edge_0, edge_1, edge_2 FROM edge").

@output("asp").
```

### Example 11: PATHS Function with SQL and Options

```prolog
edge(1, 2).
edge(2, 3).
edge(3, 4).
edge(4, 5).

% Compute paths with max depth using SQL
paths(X, Y, V) :- #PATHS("SELECT edge_0, edge_1 FROM edge", 
                         "visited=true,max_depth=2").

@output("paths").
```

### Example 12: Connected Components with SQL

```prolog
edge(1, 2).
edge(2, 1).
edge(3, 4).
edge(4, 3).

% Find connected components using SQL
cc(Node, ComponentId, Component) :- #CC("SELECT edge_0, edge_1 FROM edge", 
                                         "component_id=true").

@output("cc").
```

### Example 13: SQL Function with Filtering and JOIN

```prolog
@bind("employees", "postgresql", "company_db", "employees").

% Transitive closure over filtered PostgreSQL data
tc(X, Y) :- #TC("SELECT name, dept_id 
                 FROM employees 
                 WHERE dept_id IS NOT NULL").

@output("tc").
```

### Example 14: SQL Function from CSV

```prolog
@bind("ownerships", "csv useHeaders=true", "data", "ownerships.csv").

% Compute transitive closure of ownership relationships
tc(Company1, Company2) :- #TC("SELECT companyfrom, companyto 
                               FROM ownerships 
                               WHERE ownership_pct > 25").

@output("tc").
```

---

## Advanced Features

### Mixing SQL Rules and Vadalog Rules

You can freely mix SQL-based rules with traditional Vadalog rules:

```prolog
@bind("employees", "csv useHeaders=true", "data", "employees.csv").

% SQL rule
high_earners() <- SELECT name, salary 
                  FROM employees 
                  WHERE salary > 100000.

% Traditional Vadalog rule using SQL rule result
very_high_earner(Name) :- high_earners(Name, Salary), Salary > 150000.

% Another SQL rule referencing Vadalog-derived predicate
top_earners() <- SELECT high_earners_0, high_earners_1 
                 FROM high_earners 
                 ORDER BY high_earners_1 DESC 
                 LIMIT 10.

@output("top_earners").
```

### SQL with Subqueries

```prolog
@bind("employees", "csv useHeaders=true", "data", "employees.csv").
@bind("departments", "csv useHeaders=true", "data", "departments.csv").

above_avg_earners() <- SELECT employees_1, employees_3, departments_1 
                       FROM employees 
                       JOIN departments ON employees_2 = departments_0 
                       WHERE employees_3 > (SELECT AVG(employees_3) FROM employees).

@output("above_avg_earners").
```

### SQL with Window Functions

```prolog
@bind("sales", "postgresql", "sales_db", "transactions").

% Rank sales by region using window functions
ranked_sales() <- SELECT sales_0 as region,
                         sales_1 as product,
                         sales_2 as amount,
                         RANK() OVER (PARTITION BY sales_0 ORDER BY sales_2 DESC) as rank
                  FROM sales.

@output("ranked_sales").
```

### Common Table Expressions (CTEs)

```prolog
@bind("employees", "postgresql", "company_db", "employees").

% Use CTE (WITH clause) for complex queries
dept_summary() <- WITH dept_avg AS (
                    SELECT employees_2 as dept, AVG(employees_3) as avg_sal
                    FROM employees
                    GROUP BY employees_2
                  )
                  SELECT employees_1, employees_3, dept_avg.avg_sal
                  FROM employees
                  JOIN dept_avg ON employees_2 = dept_avg.dept
                  WHERE employees_3 > dept_avg.avg_sal.

@output("dept_summary").
```

---

## Best Practices

### 1. Choose the Right Approach

**Use SQL bodies when:**
- You need complex data transformations
- You're working with aggregations, window functions, or CTEs
- You're joining data from multiple sources
- The logic is naturally expressed in SQL

**Use traditional Vadalog when:**
- You need recursion or fixpoint computation
- The logic involves complex logical rules
- You're doing rule-based reasoning or inference

### 2. Column Naming Clarity

Always use aliases to make your output schema clear:

```prolog
% Good - clear aliases
result() <- SELECT employees_1 as employee_name,
                   departments_1 as dept_name
            FROM employees JOIN departments 
            ON employees_2 = departments_0.

% Avoid - unclear column names in output
result() <- SELECT employees_1, departments_1
            FROM employees JOIN departments 
            ON employees_2 = departments_0.
```

### 3. Leverage Data Source Bindings

Use `@bind` annotations to connect to diverse data sources, then query them uniformly with SQL:

```prolog
@bind("pg_data", "postgresql", "db1", "table1").
@bind("csv_data", "csv useHeaders=true", "data", "file.csv").
@bind("maria_data", "mariadb", "db2", "table2").

% Query all three as if they were local tables
combined() <- SELECT pg_data_0, csv_data_1, maria_data_2
              FROM pg_data
              JOIN csv_data ON pg_data_0 = csv_data_0
              JOIN maria_data ON csv_data_1 = maria_data_1.
```

### 4. Filter Data in SQL Queries

You can filter data directly within SQL queries passed to graph functions:

```prolog
% Filter edges with SQL before computing transitive closure
filtered_tc(X, Y) :- #TC("SELECT edge_0, edge_1 
                          FROM edge 
                          WHERE weight > 100").
```

### 5. Validate Table References

Ensure all tables in your SQL queries are either:
- Bound via `@bind` annotations
- Defined as facts in the program
- Derived from other rules

```prolog
% This will fail - 'unknown_table' not defined
bad_rule() <- SELECT * FROM unknown_table.

% Correct - table is bound
@bind("employees", "csv", "data", "employees.csv").
good_rule() <- SELECT * FROM employees.
```

---

## Troubleshooting

### Error: "Table not defined"

**Cause:** SQL query references a table that has no `@bind` annotation, no facts, and no deriving rules.

**Solution:** Add a `@bind` annotation or define the predicate as facts:

```prolog
@bind("employees", "csv useHeaders=true", "data", "employees.csv").
% OR
employee("Alice", 30).
employee("Bob", 25).
```

### Error: "Column not found"

**Cause:** Using wrong column naming convention (e.g., actual column names in multi-table query).

**Solution:** Use `predicateName_columnIndex` for multi-table queries:

```prolog
% Wrong
result() <- SELECT name FROM employees JOIN departments ...

% Correct
result() <- SELECT employees_1 FROM employees JOIN departments ...
```

### Error: "Invalid SQL syntax"

**Cause:** SQL query contains syntax errors.

**Solution:** Validate your SQL query using standard SQL syntax. Vadalog supports most ANSI SQL features including window functions, CTEs, and complex aggregations.

---

## Summary

SQL integration in Vadalog provides a powerful bridge between declarative logic programming and industrial-strength SQL:

✅ **Embed SQL `SELECT` statements** directly in rule bodies  
✅ **Pass SQL queries** to graph analytics functions  
✅ **Query across data sources** – PostgreSQL, MariaDB, CSV, facts, and more  
✅ **Use full SQL expressiveness** – JOINs, aggregations, CTEs, window functions  
✅ **Automatic parallelization and optimization** across distributed compute resources  
✅ **Seamless integration** with Vadalog rules and reasoning  

This hybrid approach combines the strengths of both paradigms: use SQL when you need its familiar syntax and expressive power, and use Vadalog for recursion, reasoning, and complex logical rules.


# Explanations

The `@explain` annotation enables generating detailed explanations for derived facts, helping to understand their provenance and the rules applied. Explanations can be presented in structured JSON format, natural language, or refined reports via LLM, enhancing transparency and aiding debugging.

### Materializing Explanations to External Data Sources

The `@explain` annotation configures how the explanations are stored. Its syntax is
as follows:

```prolog
@explain("datasource", "database", "table").
```

The explanations storage format varies based on the selected datasource.

**Materializing to CSV**

```prolog
@explain("csv", "disk/my-explanations/", "explanations.csv").
```

**Materializing to PostgreSQL**
```prolog
@explain("postgresql", "explanation_db", "explanation_table").
```

### Explanation Output Structure
The explanation output has three fields:

- `Fact`: The derived fact being explained.
- `JsonExplanation`: A hierarchical JSON representation of the fact's derivation.
- `TextualExplanation`: A natural language explanation based on model annotations or default verbalization.

```prolog
edge(1, 2).
edge(2, 3).
edge(3, 4).
tc(X, Y) :- edge(X, Y).
tc(X, Z) :- tc(X, Y), edge(Y, Z).
@output("tc").
@explain("console").
```

#### Json Explanation Example
```json
{
  "fact": "tc(1,4)",
  "verbalization": "there is a transitive closure from 1 to 4",
  "provenances": [
    {
      "fact": "edge(3,4)",
      "verbalization": "there is an edge from 3 to 4"
    },
    {
      "fact": "tc(1,3)",
      "verbalization": "there is a transitive closure from 1 to 3",
      "provenances": [
        {
          "fact": "tc(1,2)",
          "verbalization": "there is a transitive closure from 1 to 2",
          "provenances": [
            {
              "fact": "edge(1,2)",
              "verbalization": "there is an edge from 1 to 2"
            }
          ]
        },
        {
          "fact": "edge(2,3)",
          "verbalization": "there is an edge from 2 to 3"
        }
      ]
    }
  ]
}
```

### Textual Explanation Examples

**Without Model Annotations**

In the absence of model annotations, the explanation uses fact:

```
since edge(1,2) then tc(1,2), and since edge(2,3) then tc(1,3), and since edge(3,4) then tc(1,4).
```

**With Model Annotations**

With model annotations, explanations become more informative and context-specific:

```prolog
@model("edge", "['From:string', 'To:string']", "there is an edge from [From] to [To]").
@model("tc", "['From:string', 'To:string']", "there is a transitive closure from [From] to [To]").
```
Refined explanation:

```
since there is an edge from 1 to 2, then there is a transitive closure from 1 to 2, and since there is an edge from 2 to 3, then there is a transitive closure from 1 to 3, and since there is an edge from 3 to 4, then there is a transitive closure from 1 to 4.
```

### Explanation Scenarios and Use Cases

#### Example 1: Linear Rule Explanation without Model Annotations
```prolog
b(1).
a(X) :- b(X).
@output("a").
@explain("console").
```

Prometheux generates a generic explanation:

```
since b(1), then a(1).
```

#### Example 2: Linear Rule Explanation with Model Annotations

```prolog
@model("employee", "['Name:string']", " [Name] is an employee").
employee("Alice").
@model("manager", "['Name:string']", "[Name] is manager").
manager(X) :- employee(X).
@output("manager").
@explain("console").
```
Prometheux generates the explanation verbalizing facts according to the specified models:
```
since Alice is an employee, then Alice is a manager.
```

#### Example 3: Join Rule Explanation

```prolog
@model("developer", "['Name:string']", "[Name] is a developer").
developer("Alice").
developer("Bob").

@model("project", "['Project:string']", "[Project] project").
project("ProjectX").
project("ProjectY").

works_on(X, Y) :- developer(X), project(Y).
@model("works_on", "['Project:string']", "[X] works on project [Y]").
@output("works_on").
@explain("console").
```

Prometheux generates the explanation verbalizing facts according to the specified models:

```
since Alice is a developer and ProjectX is a project, then Alice works on ProjectX.
since Alice is a developer and ProjectY is a project, then Alice works on ProjectY.
since Bob is a developer and ProjectX is a project, then Bob works on ProjectX.
since Bob is a developer and ProjectY is a project, then Bob works on ProjectY.
```

#### Example 4: Explaining Pre-Materialized Chase Results

By setting `chase=false`, Prometheux exploits a pre-materialized chase data for explanations, avoiding recomputation.
Explanations are related to the predicates specified in the @output annotation.
To explain specific predicates not in `@output`, use the `predicates='predicate1,predicate2'` option.

**Chase Materialization:**

```prolog
edge(1, 2).
edge(2, 3).
edge(3, 4).
tc(X, Y) :- edge(X, Y).
tc(X, Z) :- tc(X, Y), edge(Y, Z).
@output("tc").
@chase("csv", "datasets", "chase_results").
```

**Explanation of Pre-Materialized Data:**

```prolog
@input("chase_results").
@bind("chase_results", "csv useHeaders=true", "datasets", "chase_results").
@model("tc", "['From:string', 'To:string']", "there is a transitive closure from [From] to [To]").
@model("edge", "['From:string', 'To:string']", "there is an edge from [From] to [To]").
my_explanation(Fact, ProvenanceLeft, ProvenanceRight, RuleDescription) :- 
    chase_results(Fact, ProvenanceLeft, ProvenanceRight, RuleDescription).
@output("my_explanation").
@explain("console chase=false, predicates='tc'").
```

Prometheux generates the following explanation:

```
since there is an edge from 1 to 2, then there is a transitive closure from 1 to 2.
since there is an edge from 2 to 3, then there is a transitive closure from 1 to 3.
since there is an edge from 3 to 4, then there is a transitive closure from 1 to 4.
```

#### Example 7: Explaining Multiple Connected Chases

Multiple chases are connected by using the results of the first in the second.
Model annotations provide detailed descriptions for each predicate.
Explanations are generated for both path and tc predicates.

By setting chase=false, explanations are generated based on pre-materialized chase data.
The predicates='path,tc' option specifies the predicates to explain, especially if they are not in @output.

Prometheu will generate comprehensive explanations that cover derivations across multiple connected chases.

**Step 1: First Chase - Computing Transitive Closure**

```prolog
edge(1, 2).
edge(2, 3).
edge(3, 4).
tc(X, Y) :- edge(X, Y).
tc(X, Z) :- tc(X, Y), edge(Y, Z).
@output("tc").
@bind("tc", "csv", "path/to/datasets", "tc").
@chase("csv saveMode=append", "path/to/datasets", "chase").
```

**Step 2: Second Chase - Computing Paths Using Previous Results**

```prolog
arc(1, 2).
arc(2, 3).
arc(3, 4).
@input("tc").
@bind("tc", "csv", "path/to/datasets", "tc").
path(X, Y) :- tc(X, Y).
path(X, Z) :- path(X, Y), arc(Y, Z).
@output("path").
@chase("csv saveMode=append", "path/to/datasets", "chase").
```

**Step 3: Explaining the Combined Results**

```prolog
@model("edge", "['From:string', 'To:string']", "There is an edge from [From] to [To]").
@model("arc", "['From:string', 'To:string']", "There is an arc from [From] to [To]").
@model("path", "['From:string', 'To:string']", "There is a path from [From] to [To]").
@model("tc", "['From:string', 'To:string']", "There is a transitive closure from [From] to [To]").
@input("chase").
@bind("chase", "csv useHeaders=true", "path/to/datasets", "chase").
explain(Fact, ProvenanceLeft, ProvenanceRight, RuleDescription) :- 
    chase(Fact, ProvenanceLeft, ProvenanceRight, RuleDescription).
@output("explain").
@explain("console chase=false, predicates='path,tc'").
```
# Graph RAG

The `graph_rag` function processes a user's natural language question in conjunction with a specified Vadalog program to produce reasoning-based results.

---

## Function

```python
def graph_rag(question=None, vadalog_program=None)
```
**Parameters**
- `question` _(str)_:
The user's natural language question to be processed. If no question is provided, the function operates on the Vadalog program alone.
- `vadalog_program` _(str)_:
The file path to the .vada file containing the Vadalog program with reasoning rules.

**Returns**

- The result of the graph reasoning and retrieval process, combining the user's question with the logic defined in the Vadalog program.

**Example**

The following example demonstrates how to perform a Graph RAG task:

```python
import prometheux_chain as pmtx

# Connect data via reasoning using the Vadalog program "connect_data.vada".
px.graph_rag(vadalog_program="connect_data.vada")

# Perform RAG over the results stored connect_data reasoning
px.graph_rag(question="Can you explain why the company C-Corp owns Q-Tech?")

# Perform both graph reasoning via the company control task and RAG to perform explanations
px.graph_rag(question="explain all controls", vadalog_program="company_control.vada")
```

A possible set of `Vadalog` rules in the `connect_data.vada` file is as follows:
```prolog
@input("my_datasource").
@bind("my_datasource","postgresql","ownership_db","ownership_table").

own(From,To) :- my_datasource(From,To,Weight).
@output("own").

@model("own","['from:string','to:string']","The company [from] owns the company [to]").
@model("my_datasource","['from:string','to:string','weight:double']","The company [from] owns [weight] shares of the company [to]").
```

A possible set of `Vadalog` rules in the `company_control.vada` file is as follows:

```prolog
@input("own").
@bind("own","postgresql","ownership_db","ownership_table").
@model("own", "['X:string','Y:string','Z:double']","[X] owns [Z] of [Y]").

@model("indirectOwn", "['companyFrom:string','middleCompany:string','companyTo:string','ownership:double']","[companyFrom] owns [ownership] of [companyTo] via [middleCompany]").
@model("control", "['companyFrom:string','companyTo:string']","[companyFrom] controls [companyTo]").
indirectOwn(X,Z,Y,Q) :- control(X,Z), own(Z,Y,Q).
indirectOwn(X,Y,Y,Q) :- own(X,Y,Q).
jointIndirectOwn(X,Y,J) :- indirectOwn(X,Z,Y,Q), J=msum(Q).
control(X,Y) :- jointIndirectOwn(X,Y,Q), Q>0.5.
@output("control").
```
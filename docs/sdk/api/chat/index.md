# chat

---

**Module**: `prometheux_chain.chat.client`

## Functions

```python
def chat(nlQuery: str) -> dict
```

The `chat` function allows you to interact with the reasoning engine by asking natural language questions.
You can ask about the results inferred in the reasoning process and their explanations or about the logic predicates and rules involved.

### Parameters:
- `nlQuery` (str): A natural language query that you want to submit to the reasoning engine.

### Returns:
- `dict`: A dictionary containing the response from the reasoning engine, including the explanation of the fact or rule set.

### Example Usage

You can ask two types of questions:

#### 1. Explanation of a specific inferred result

```python
print(pmtx.chat("What is the risk probability from pbalance to pbalance and why?"))
```

**Output**
```
The risk probability from pbalance to pbalance is 0.9 because an event with ~E1 caused a transition from pbalance to pbalance with a 0.9 probability.
```


#### 2. Explanation of the logic predicates and rules

```python
print(pmtx.chat("How is the risk probability derived from?"))
```

**Output**
```
The risk probability is derived from the event data and the probabilities associated with each transition between states.
```
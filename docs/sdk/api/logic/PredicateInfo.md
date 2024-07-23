# PredicateInfo

---
**Module**: `prometheux_chain.logic.PredicateInfo`

Classes
-------

```python
PredicateInfo(name, num_args=0, args=None)
```

Represents information about a predicate, including its name, number of arguments, and a list of the arguments.

**Attributes:**

- **name**: The name of the predicate.
- **num_args**: The number of arguments of the predicate.
- **args**: A list of arguments for the predicate.

 
### Methods

    `from_dict(data)`
    : Creates a PredicateInfo instance from a dictionary.
    
    `to_dict(self)`
    : Converts the object to a dictionary suitable for JSON serialization.
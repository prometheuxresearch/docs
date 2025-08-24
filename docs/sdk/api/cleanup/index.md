# cleaner

The `cleaner` module provides function to remove all virtual Knowledge Graph resources associated with the user.

## Functions

---

```python
 def cleanup()
```

## Parameters
This function does not take any parameters in input.

## Raises
- `Exception`:
If an HTTP error occurs during the cleanup process, an exception is raised with details about the HTTP status code and the error message.

## Returns
- This function does not return any value. Instead, it prints a confirmation message upon successful cleanup.


## Usage Example
```python 
import prometheux_chain as px

try:
    px.cleanup()  # Cleans up all virtual KG resources
except Exception as e:
    print(f"An error occurred during cleanup: {e}")
```

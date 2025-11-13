---
slug: /api/endpoints/vadalog
---

# Vadalog API

The Vadalog API provides direct access to the Vadalog reasoning engine for evaluating logic programs and managing execution.

## Evaluate Program

Execute a Vadalog program with specified parameters.

### HTTP Request

```bash
POST /api/v1/vadalog/evaluate
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| program | string | Yes | Vadalog program code |
| parameters | object | No | Program parameters |
| execution_options | object | No | Execution configuration |
| timeout | integer | No | Execution timeout in seconds (default: 300) |

The execution_options object can contain:

| Field | Type | Description |
|-------|------|-------------|
| step_by_step | boolean | Enable step-by-step execution |
| materialize_intermediate | boolean | Materialize intermediate results |
| debug_mode | boolean | Enable debug output |
| max_iterations | integer | Maximum number of iterations |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/vadalog/evaluate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "program": "@input(\"products\").\n@output(\"expensive_products\").\nexpensive_products(Product, Price) :- products(Product, Price), Price > 100.",
    "parameters": {
      "price_threshold": 100
    },
    "execution_options": {
      "step_by_step": false,
      "materialize_intermediate": true,
      "debug_mode": false,
      "max_iterations": 1000
    },
    "timeout": 300
  }'
```

### Python Example

```python
import requests

def evaluate_vadalog_program(base_url, token, program, parameters=None, 
                           execution_options=None, timeout=300):
    """Evaluate a Vadalog program."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "program": program,
        "parameters": parameters or {},
        "execution_options": execution_options or {},
        "timeout": timeout
    }
    
    url = f"{base_url}/vadalog/evaluate"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
program = """
@input("products").
@output("expensive_products").
expensive_products(Product, Price) :- products(Product, Price), Price > ?threshold.
"""

parameters = {"threshold": 100}
execution_options = {
    "step_by_step": False,
    "materialize_intermediate": True,
    "debug_mode": False,
    "max_iterations": 1000
}

result = evaluate_vadalog_program(base_url, token, program, parameters, execution_options)
print(f"Execution completed in {result['data']['execution_time']}s")
print(f"Results: {result['data']['results']}")
```

### Response

```json
{
  "data": {
    "execution_id": "exec_12345",
    "results": {
      "expensive_products": [
        ["Laptop", 1200],
        ["Smartphone", 800],
        ["Tablet", 600]
      ]
    },
    "execution_time": 0.45,
    "iterations": 3,
    "memory_usage": "12MB",
    "statistics": {
      "facts_derived": 150,
      "rules_fired": 25
    }
  },
  "message": "Program evaluated successfully",
  "status": "success"
}
```

## Stop Evaluation

Force stop a running Vadalog evaluation.

### HTTP Request

```bash
POST /api/v1/vadalog/stop
```

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/vadalog/stop" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def stop_vadalog_evaluation(base_url, token):
    """Stop a running Vadalog evaluation."""
    headers = {"Authorization": f"Bearer {token}"}
    
    url = f"{base_url}/vadalog/stop"
    response = requests.post(url, headers=headers)
    return response.json()

# Usage
result = stop_vadalog_evaluation(base_url, token)
print(result['message'])
```

## Validate Program

Validate a Vadalog program syntax without executing it.

### HTTP Request

```bash
POST /api/v1/vadalog/validate
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| program | string | Yes | Vadalog program code to validate |
| strict_mode | boolean | No | Enable strict validation (default: false) |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/vadalog/validate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "program": "@input(\"products\").\n@output(\"expensive_products\").\nexpensive_products(Product, Price) :- products(Product, Price), Price > 100.",
    "strict_mode": true
  }'
```

### Python Example

```python
def validate_vadalog_program(base_url, token, program, strict_mode=False):
    """Validate a Vadalog program syntax."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "program": program,
        "strict_mode": strict_mode
    }
    
    url = f"{base_url}/vadalog/validate"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
program = """
@input("products").
@output("expensive_products").
expensive_products(Product, Price) :- products(Product, Price), Price > 100.
"""

result = validate_vadalog_program(base_url, token, program, strict_mode=True)
if result['status'] == 'success':
    print("Program is valid!")
    print(f"Analysis: {result['data']['analysis']}")
else:
    print(f"Validation errors: {result['data']['errors']}")
```

## Get Execution Status

Check the status of a running or completed evaluation.

### HTTP Request

```bash
GET /api/v1/vadalog/status?execution_id={execution_id}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| execution_id | string | Yes | The execution ID to check |

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/vadalog/status?execution_id=exec_12345" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def get_vadalog_execution_status(base_url, token, execution_id):
    """Get the status of a Vadalog execution."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"execution_id": execution_id}
    
    url = f"{base_url}/vadalog/status"
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
status = get_vadalog_execution_status(base_url, token, "exec_12345")
print(f"Execution status: {status['data']['status']}")
print(f"Progress: {status['data']['progress']}%")
if status['data']['status'] == 'completed':
    print(f"Results available: {len(status['data']['results'])} facts")
```

## List Built-in Functions

Get a list of available built-in functions for Vadalog programs.

### HTTP Request

```bash
GET /api/v1/vadalog/functions?category=all
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Function category: "all", "math", "string", "date", "aggregation" (default: "all") |

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/vadalog/functions?category=math" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def list_vadalog_functions(base_url, token, category="all"):
    """List available Vadalog built-in functions."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"category": category}
    
    url = f"{base_url}/vadalog/functions"
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Usage
functions = list_vadalog_functions(base_url, token, "math")
print("Available math functions:")
for func in functions['data']['functions']:
    print(f"  - {func['name']}: {func['description']}")
    print(f"    Syntax: {func['syntax']}")
    print(f"    Example: {func['example']}")
```

## Explain Program

Get an explanation of how a Vadalog program works.

### HTTP Request

```bash
POST /api/v1/vadalog/explain
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| program | string | Yes | Vadalog program to explain |
| explanation_type | string | No | Type: "overview", "detailed", "step_by_step" (default: "overview") |
| include_examples | boolean | No | Include usage examples (default: true) |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/vadalog/explain" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "program": "@input(\"products\").\n@output(\"expensive_products\").\nexpensive_products(Product, Price) :- products(Product, Price), Price > 100.",
    "explanation_type": "detailed",
    "include_examples": true
  }'
```

### Python Example

```python
def explain_vadalog_program(base_url, token, program, explanation_type="overview", 
                           include_examples=True):
    """Get an explanation of a Vadalog program."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "program": program,
        "explanation_type": explanation_type,
        "include_examples": include_examples
    }
    
    url = f"{base_url}/vadalog/explain"
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Usage
program = """
@input("products").
@output("expensive_products").
expensive_products(Product, Price) :- products(Product, Price), Price > 100.
"""

explanation = explain_vadalog_program(base_url, token, program, "detailed")
print("Program Explanation:")
print(explanation['data']['explanation'])
if explanation['data']['examples']:
    print("\nExamples:")
    for example in explanation['data']['examples']:
        print(f"  - {example}")
```

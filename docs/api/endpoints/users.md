# Users API

The Users API allows you to manage user settings, configurations, and monitor API usage.

## Get User Role

Retrieve the current user's role.

### HTTP Request

```bash
GET /api/v1/users/get-role
```

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/users/get-role" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
import requests

def get_user_role(base_url, token):
    """Get the current user's role."""
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{base_url}/users/get-role", headers=headers)
    return response.json()

# Usage
base_url = "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1"
token = "YOUR_JWT_TOKEN"
result = get_user_role(base_url, token)
print(f"User role: {result['data']['role']}")
```

### Response

```json
{
  "data": {
    "role": "user"
  },
  "message": "Role retrieved successfully",
  "status": "success"
}
```

## Save User Configuration

Save user-specific configuration settings.

### HTTP Request

```bash
POST /api/v1/users/save-config
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| config_data | object | Yes | Configuration data to save |
| scope | string | No | Configuration scope (default: "user") |

### cURL Example

```bash
curl -X POST "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/users/save-config" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "config_data": {
      "theme": "dark",
      "language": "en",
      "notifications": true
    },
    "scope": "user"
  }'
```

### Python Example

```python
import requests

def save_user_config(base_url, token, config_data, scope="user"):
    """Save user configuration."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "config_data": config_data,
        "scope": scope
    }
    
    response = requests.post(f"{base_url}/users/save-config", 
                           headers=headers, json=data)
    return response.json()

# Usage
config = {
    "theme": "dark",
    "language": "en", 
    "notifications": True
}
result = save_user_config(base_url, token, config)
print(result['message'])
```

## Load User Configuration

Load user-specific configuration settings.

### HTTP Request

```bash
GET /api/v1/users/load-config?scope=user
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| scope | string | No | Configuration scope (default: "user") |

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/users/load-config?scope=user" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def load_user_config(base_url, token, scope="user"):
    """Load user configuration."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"scope": scope}
    
    response = requests.get(f"{base_url}/users/load-config", 
                          headers=headers, params=params)
    return response.json()

# Usage
config = load_user_config(base_url, token)
print(f"Loaded config: {config['data']}")
```

## Get Usage Status

Get current API usage statistics and limits.

### HTTP Request

```bash
GET /api/v1/users/usage-status
```

### cURL Example

```bash
curl -X GET "https://platform.prometheux.ai/jarvispy/my-org/my-user/api/v1/users/usage-status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Python Example

```python
def get_usage_status(base_url, token):
    """Get API usage status."""
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{base_url}/users/usage-status", headers=headers)
    return response.json()

# Usage
usage = get_usage_status(base_url, token)
print(f"LLM usage: {usage['data']['llm_usage']}")
print(f"Embedding usage: {usage['data']['embedding_usage']}")
```

### Response

```json
{
  "data": {
    "llm_usage": {
      "current": 150,
      "limit": 1000,
      "remaining": 850
    },
    "embedding_usage": {
      "current": 50,
      "limit": 500,
      "remaining": 450
    }
  },
  "message": "Usage status retrieved successfully",
  "status": "success"
}
```

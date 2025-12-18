# Chat API

The Prometheux documentation includes an AI-powered chat API that provides Vadalog code assistance and answers questions about the platform. This API is available at `https://chat-docs.prometheux.ai/api/docsChat` and can be integrated into your applications.

---

## Overview

The Chat API provides:
- **Vadalog code generation** with complete, runnable examples
- **Syntax assistance** and debugging help
- **Documentation search** integration via Algolia
- **Context-aware responses** based on Prometheux documentation
- **Grammar-compliant code** following Vadalog best practices

---

## Endpoints

### `/api/docsChat` (Streaming)

**Purpose**: Optimized for chat interfaces and streaming responses.

- **URL**: `https://chat-docs.prometheux.ai/api/docsChat`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Response**: Streaming text (AI SDK format)

#### Request Format

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Show me a PostgreSQL connection example"
    }
  ]
}
```

#### Response Format

Streaming text response in AI SDK format:
```
0:"Below"
0:" is"
0:" a"
0:" complete"
0:" Vadalog"
0:" example..."
```

#### Example Usage

**JavaScript/TypeScript:**
```javascript
const response = await fetch('https://chat-docs.prometheux.ai/api/docsChat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'How do I connect to Neo4j?' }
    ]
  })
});

// Handle streaming response
const reader = response.body.getReader();
const decoder = new TextDecoder();
let result = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value, { stream: true });
  // Parse AI SDK format: 0:"text"
  const lines = chunk.split('\n');
  for (const line of lines) {
    if (line.startsWith('0:"') && line.endsWith('"')) {
      result += line.slice(3, -1); // Extract text content
    }
  }
}

console.log(result); // Complete Vadalog code example
```

**Python:**
```python
import requests
import re

url = "https://chat-docs.prometheux.ai/api/docsChat"
payload = {
    "messages": [
        {"role": "user", "content": "Show me aggregation examples"}
    ]
}

response = requests.post(url, json=payload, stream=True)

result = ""
for chunk in response.iter_content(chunk_size=1024, decode_unicode=True):
    if chunk:
        # Parse AI SDK format: 0:"text"
        lines = chunk.split('\n')
        for line in lines:
            if line.startswith('0:"') and line.endswith('"'):
                result += line[3:-1]  # Extract text content

print(result)  # Complete Vadalog code
```

**cURL:**
```bash
curl -X POST https://chat-docs.prometheux.ai/api/docsChat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "How do I use math functions?"}
    ]
  }'
```

---

### `/api/vadalog` (Standard JSON)

**Purpose**: Standard REST API for programmatic integration.

- **URL**: `https://chat-docs.prometheux.ai/api/vadalog`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Response**: Standard JSON

#### Request Format

```json
{
  "query": "Show me a PostgreSQL connection example",
  "context": "database connection",
  "include_docs": true
}
```

#### Response Format

```json
{
  "response": "Below is a complete Vadalog example...",
  "code_examples": [
    {
      "language": "vadalog",
      "code": "@bind(\"customer\", \"postgresql host=localhost port=5432 user=myuser password=mypass\", \"mydb\", \"customer\").\n@model(\"customer\", \"['id:int', 'name:string', 'age:int']\").\n@output(\"result\").",
      "description": "PostgreSQL connection with customer data processing"
    }
  ],
  "relevant_docs": [
    {
      "title": "Connecting to Databases", 
      "url": "https://api.prometheux.ai/docs/learn/vadalog/data-sources",
      "excerpt": "PostgreSQL database connections..."
    }
  ],
  "metadata": {
    "provider": "Azure OpenAI",
    "model": "gpt-4o",
    "tokens_used": 1247,
    "search_results": 3
  }
}
```

#### Example Usage

**JavaScript/TypeScript:**
```javascript
const response = await fetch('https://chat-docs.prometheux.ai/api/vadalog', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'How do I use aggregations in Vadalog?',
    include_docs: true
  })
});

const data = await response.json();
console.log(data.response);        // Text response
console.log(data.code_examples);   // Extracted code blocks
console.log(data.relevant_docs);   // Related documentation
```

**Python:**
```python
import requests

url = "https://chat-docs.prometheux.ai/api/vadalog"
payload = {
    "query": "Show me CSV file processing",
    "context": "data integration",
    "include_docs": True
}

response = requests.post(url, json=payload)
data = response.json()

print(f"Response: {data['response']}")
print(f"Code examples: {len(data['code_examples'])}")
print(f"Related docs: {len(data['relevant_docs'])}")
```

**cURL:**
```bash
curl -X POST https://chat-docs.prometheux.ai/api/vadalog \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Show me CSV file processing",
    "context": "data integration", 
    "include_docs": true
  }'
```

---

## Features

### **Vadalog Code Generation**
- Complete, runnable Vadalog programs
- Proper syntax with all necessary annotations
- Database connection examples
- Data processing workflows
- Grammar-compliant code

### **Documentation Integration**
- Searches Prometheux documentation via Algolia
- Provides relevant context from actual docs
- References specific documentation sections
- Up-to-date with latest features

### **AI-Powered Assistance**
- Powered by Azure OpenAI (gpt-4o)
- Context-aware responses
- Iterative conversation support
- Syntax error prevention

---

## Response Types

### **Streaming Response** (`/api/docsChat`)
- **Best for**: Chat interfaces, real-time applications
- **Format**: AI SDK compatible streaming
- **Use case**: Frontend chat components

### **JSON Response** (`/api/vadalog`)
- **Best for**: Programmatic integration, APIs, automation
- **Format**: Standard JSON with structured data
- **Use case**: Backend services, integrations, analysis

---

## Rate Limits

- **Rate limit**: 180 requests per minute
- **Token limit**: 30,000,000 tokens per minute
- **Response limit**: 1500 tokens per response
- **Concurrent requests**: Supported

---

## Error Handling

### **Error Response Format**

```json
{
  "error": "AI assistant not available",
  "message": "Service temporarily unavailable",
  "status": 503,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### **Common Error Codes**

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Bad Request | Check request format |
| 429 | Rate Limited | Reduce request frequency |
| 503 | Service Unavailable | Retry after delay |
| 500 | Internal Error | Contact support |

---

## Best Practices

1. **Use conversation context**: Include previous messages for better responses
2. **Be specific**: Ask detailed questions about Vadalog syntax
3. **Request complete examples**: Ask for "complete, runnable code"
4. **Handle streaming**: Implement proper streaming for real-time responses
5. **Error handling**: Implement retry logic for rate limits

---

## Examples

### **Database Connections**

**JavaScript/TypeScript:**
```javascript
const response = await fetch('https://chat-docs.prometheux.ai/api/docsChat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'How do I connect to PostgreSQL with authentication?' }
    ]
  })
});

// Parse streaming response
const reader = response.body.getReader();
const decoder = new TextDecoder();
let vadalogCode = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value, { stream: true });
  const lines = chunk.split('\n');
  for (const line of lines) {
    if (line.startsWith('0:"') && line.endsWith('"')) {
      vadalogCode += line.slice(3, -1);
    }
  }
}

console.log(vadalogCode); // Complete @bind example with connection parameters
```

**Python:**
```python
import requests

url = "https://chat-docs.prometheux.ai/api/docsChat"
payload = {
    "messages": [
        {"role": "user", "content": "How do I connect to PostgreSQL with authentication?"}
    ]
}

response = requests.post(url, json=payload, stream=True)

vadalog_code = ""
for chunk in response.iter_content(chunk_size=1024, decode_unicode=True):
    if chunk:
        lines = chunk.split('\n')
        for line in lines:
            if line.startswith('0:"') and line.endswith('"'):
                vadalog_code += line[3:-1]

print(vadalog_code)  # Complete @bind example with connection parameters
```

**cURL:**
```bash
curl -X POST https://chat-docs.prometheux.ai/api/docsChat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "How do I connect to PostgreSQL with authentication?"}
    ]
  }'
```

### **Data Processing with Aggregations**

**JavaScript/TypeScript:**
```javascript
const response = await fetch('https://chat-docs.prometheux.ai/api/vadalog', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'Show me aggregation examples with grouping',
    context: 'data analysis',
    include_docs: true
  })
});

const data = await response.json();
console.log('Response:', data.response);
console.log('Code Examples:', data.code_examples);
data.code_examples.forEach(example => {
  console.log(`\n--- ${example.description} ---`);
  console.log(example.code);
});
```

**Python:**
```python
import requests

url = "https://chat-docs.prometheux.ai/api/vadalog"
payload = {
    "query": "Show me aggregation examples with grouping",
    "context": "data analysis",
    "include_docs": True
}

response = requests.post(url, json=payload)
data = response.json()

print(f"Response: {data['response']}")
for example in data['code_examples']:
    print(f"\n--- {example['description']} ---")
    print(example['code'])
```

**cURL:**
```bash
curl -X POST https://chat-docs.prometheux.ai/api/vadalog \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Show me aggregation examples with grouping",
    "context": "data analysis",
    "include_docs": true
  }' | jq '.code_examples[].code'
```

### **Advanced AI Features**

**JavaScript/TypeScript:**
```javascript
const response = await fetch('https://chat-docs.prometheux.ai/api/docsChat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'How do I use LLM functions and embeddings in Vadalog?' }
    ]
  })
});

// Handle conversation context
const conversationHistory = [
  { role: 'user', content: 'How do I use LLM functions and embeddings in Vadalog?' }
];

// Parse response and continue conversation
const reader = response.body.getReader();
const decoder = new TextDecoder();
let assistantResponse = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value, { stream: true });
  const lines = chunk.split('\n');
  for (const line of lines) {
    if (line.startsWith('0:"') && line.endsWith('"')) {
      assistantResponse += line.slice(3, -1);
    }
  }
}

// Add to conversation history for follow-up questions
conversationHistory.push({ role: 'assistant', content: assistantResponse });
console.log('AI Functions Example:', assistantResponse);
```

**Python:**
```python
import requests

url = "https://chat-docs.prometheux.ai/api/docsChat"

# Start conversation
conversation = [
    {"role": "user", "content": "How do I use LLM functions and embeddings in Vadalog?"}
]

response = requests.post(url, json={"messages": conversation}, stream=True)

assistant_response = ""
for chunk in response.iter_content(chunk_size=1024, decode_unicode=True):
    if chunk:
        lines = chunk.split('\n')
        for line in lines:
            if line.startswith('0:"') and line.endswith('"'):
                assistant_response += line[3:-1]

# Add to conversation for follow-up
conversation.append({"role": "assistant", "content": assistant_response})
print("AI Functions Example:", assistant_response)

# Follow-up question
conversation.append({"role": "user", "content": "Can you show me a similarity analysis example?"})
follow_up = requests.post(url, json={"messages": conversation}, stream=True)
# Process follow-up response...
```

**cURL:**
```bash
# Initial request
curl -X POST https://chat-docs.prometheux.ai/api/docsChat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "How do I use LLM functions and embeddings in Vadalog?"}
    ]
  }'

# Follow-up with conversation context
curl -X POST https://chat-docs.prometheux.ai/api/docsChat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "How do I use LLM functions and embeddings in Vadalog?"},
      {"role": "assistant", "content": "Previous response..."},
      {"role": "user", "content": "Can you show me a similarity analysis example?"}
    ]
  }'
```

---

## Integration

### **Frontend Integration**
Use the streaming endpoint with AI SDK components for real-time chat interfaces.

### **Backend Integration**  
Use the JSON endpoint for programmatic access, automation, and service integration.

### **Documentation Bot**
Embed the chat functionality directly in your documentation using the provided components.

The Chat API provides comprehensive Vadalog assistance powered by AI and integrated with the complete Prometheux documentation. 
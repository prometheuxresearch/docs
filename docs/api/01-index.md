---
slug: /api
---

# Overview

The Prometheux platform provides a comprehensive REST API that allows you to interact with all platform features programmatically. This API enables you to manage projects, concepts, data sources, execute Vadalog programs, and more.

## Base URL

All API endpoints are relative to your Prometheux platform instance:

```
https://platform.prometheux.ai/jarvispy/{organization}/{username}/api/v1/
```

Where:
- `{organization}` is your organization identifier (e.g., "my-org")
- `{username}` is your username (e.g., "my-user")

## Authentication

All API requests require authentication using a Bearer token in the Authorization header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format

All API responses follow a consistent format:

```json
{
  "data": {},           // Response data (varies by endpoint)
  "message": "string",  // Human-readable message
  "status": "success"   // Status: "success" or "error"
}
```

## API Categories

The API is organized into the following categories:

- **[Users](/api/endpoints/users)** - User management and configuration
- **[Data Sources](/api/endpoints/data)** - Data connection and management
- **[Projects](/api/endpoints/projects)** - Project management
- **[Concepts](/api/endpoints/concepts)** - Concept execution and management
- **[Vadalog](/api/endpoints/vadalog)** - Vadalog program evaluation

## Getting Started

1. **Obtain your JWT token** from the Prometheux platform
2. **Choose an endpoint** from the categories above
3. **Make your first API call** using curl or your preferred HTTP client

## Rate Limits

API usage is subject to rate limits based on your subscription plan. Monitor your usage through the `/users/usage-status` endpoint.

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid or missing token)
- `500` - Internal Server Error

Error responses include detailed messages in the response body to help with debugging.

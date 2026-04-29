# Goodkid Zone Backend API Documentation

## Overview

This document describes the backend API endpoints for the Goodkid Zone application. The backend is built with Next.js 16 and provides authentication and user management features.

## Authentication Endpoints

### 1. User Registration
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Validation Rules:**
- Email must be valid and not already registered
- Password must be at least 8 characters
- Passwords must match
- Name is required and cannot be empty

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please sign in.",
  "user": {
    "id": "user_xxx",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": {
    "email": "Email already registered",
    "password": "Password must be at least 8 characters"
  }
}
```

---

### 2. User Sign In
**Endpoint:** `POST /api/auth/signin`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Sign in successful",
  "token": "session_xxx",
  "user": {
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Details:**
- Sets an HTTP-only secure cookie with auth token
- Token valid for 7 days
- Token also returned in response for client-side storage

**Error Response (400):**
```json
{
  "success": false,
  "errors": {
    "email": "Email is required"
  }
}
```

---

### 3. User Logout
**Endpoint:** `POST /api/auth/logout`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Details:**
- Clears the auth_token cookie
- Client should remove auth_token from localStorage

---

## User Endpoints

### 1. Get Current User
**Endpoint:** `GET /api/user`

**Headers:**
```
Cookie: auth_token=session_xxx
```

**Success Response (200):**
```json
{
  "authenticated": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "User"
  }
}
```

**Error Response (401):**
```json
{
  "authenticated": false,
  "error": "Not authenticated"
}
```

---

## Frontend Pages

### Sign Up Page
- **Route:** `/signup`
- **Features:**
  - Registration form with validation
  - Real-time error display
  - Redirect to sign in on success

### Sign In Page
- **Route:** `/signin`
- **Features:**
  - Login form
  - Token storage in localStorage
  - Redirect to dashboard on success

### Dashboard Page
- **Route:** `/dashboard`
- **Features:**
  - Protected page (requires auth token)
  - User welcome message
  - Quick links to games, videos, shop
  - Progress tracking
  - Logout functionality

---

## Error Handling

All endpoints include comprehensive error handling:

1. **Validation Errors:** Field-specific error messages (400)
2. **Authentication Errors:** Clear error messages (401)
3. **Server Errors:** Generic error message (500)

Each response includes:
- `success` boolean indicating success/failure
- `errors` object with field-specific validation errors (if applicable)
- `error` string with general error message (if applicable)

---

## Security Notes

**Current Implementation (Development):**
- Uses in-memory user storage
- Passwords stored in plain text (for development only)

**Production Recommendations:**
1. Use a proper database (PostgreSQL, MongoDB, etc.)
2. Hash passwords with bcrypt
3. Implement proper JWT token validation
4. Use HTTPS only for cookies
5. Add rate limiting for auth endpoints
6. Implement email verification
7. Add password reset functionality
8. Use environment variables for secrets

---

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "confirmPassword": "securePassword123"
  }'
```

**Sign In:**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Get User:**
```bash
curl -X GET http://localhost:3000/api/user \
  -H "Cookie: auth_token=session_xxx"
```

---

## Database Integration

When moving to a database, implement these models:

### User Model
```
- id (primary key)
- email (unique)
- name
- password_hash
- createdAt
- updatedAt
```

### Session Model (optional, if using sessions instead of JWT)
```
- id (primary key)
- userId (foreign key)
- token
- expiresAt
- createdAt
```

---

## Future Enhancements

1. Password reset via email
2. Email verification
3. Two-factor authentication
4. OAuth integration (Google, Apple)
5. User profile updates
6. Role-based access control (admin, moderator, user)
7. Account deletion
8. Session management

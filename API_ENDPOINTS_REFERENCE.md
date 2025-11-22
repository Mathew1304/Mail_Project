# API Endpoints Quick Reference

## Base URL
```
http://localhost:3001/api
```

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response (201):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token"
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token"
}
```

### Get Current User Profile
```
GET /auth/profile
Authorization: Bearer {token}

Response (200):
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer {token}

Response (200):
{
  "success": true
}
```

---

## Email Endpoints

### Create Email (Send or Draft)
```
POST /emails
Authorization: Bearer {token}
Content-Type: application/json

{
  "user_id": "uuid",
  "folder_id": "uuid",
  "from_email": "sender@example.com",
  "from_name": "John Doe",
  "to_emails": [
    { "email": "recipient@example.com", "name": "Jane Doe" }
  ],
  "cc_emails": [],
  "bcc_emails": [],
  "subject": "Hello",
  "body": "Email content",
  "is_draft": false,
  "has_attachments": false,
  "thread_id": "uuid",
  "created_at": "2024-01-01T00:00:00Z",
  "sent_at": "2024-01-01T00:00:00Z"
}

Response (201):
{
  "id": "uuid",
  "user_id": "uuid",
  "folder_id": "uuid",
  "from_email": "sender@example.com",
  "from_name": "John Doe",
  "to_emails": [...],
  "subject": "Hello",
  "body": "Email content",
  "is_read": false,
  "is_starred": false,
  "is_draft": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get All Emails
```
GET /emails?userId={userId}&folderId={folderId}
Authorization: Bearer {token}

Response (200):
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "folder_id": "uuid",
    "from_email": "sender@example.com",
    "from_name": "John Doe",
    "to_emails": [...],
    "subject": "Hello",
    "body": "Email content",
    "is_read": false,
    "is_starred": false,
    "is_draft": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get Single Email
```
GET /emails/{emailId}
Authorization: Bearer {token}

Response (200):
{
  "id": "uuid",
  "user_id": "uuid",
  "folder_id": "uuid",
  "from_email": "sender@example.com",
  "from_name": "John Doe",
  "to_emails": [...],
  "subject": "Hello",
  "body": "Email content",
  "is_read": false,
  "is_starred": false,
  "is_draft": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Update Email
```
PUT /emails/{emailId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "is_read": true,
  "is_starred": true,
  "folder_id": "uuid"
}

Response (200):
{
  "id": "uuid",
  "user_id": "uuid",
  "is_read": true,
  "is_starred": true,
  "folder_id": "uuid",
  ...
}
```

### Delete Email
```
DELETE /emails/{emailId}
Authorization: Bearer {token}

Response (200):
{
  "success": true
}
```

### Get Drafts
```
GET /emails/drafts?userId={userId}
Authorization: Bearer {token}

Response (200):
[
  {
    "id": "uuid",
    "is_draft": true,
    ...
  }
]
```

---

## Folder Endpoints

### Get All Folders
```
GET /folders?userId={userId}
Authorization: Bearer {token}

Response (200):
[
  {
    "id": "uuid",
    "name": "Inbox",
    "user_id": "uuid",
    "icon": "inbox",
    "color": "#3b82f6",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Create Folder
```
POST /folders
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Folder",
  "user_id": "uuid",
  "icon": "folder",
  "color": "#3b82f6"
}

Response (201):
{
  "id": "uuid",
  "name": "My Folder",
  "user_id": "uuid",
  "icon": "folder",
  "color": "#3b82f6",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Update Folder
```
PUT /folders/{folderId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Folder",
  "icon": "star",
  "color": "#ef4444"
}

Response (200):
{
  "id": "uuid",
  "name": "Updated Folder",
  "user_id": "uuid",
  "icon": "star",
  "color": "#ef4444",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Delete Folder
```
DELETE /folders/{folderId}
Authorization: Bearer {token}

Response (200):
{
  "success": true
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input",
  "message": "Email is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Email not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

---

## Default Folders to Create

When a user registers, create these folders:

1. **Inbox**
   - name: "Inbox"
   - icon: "inbox"
   - color: "#3b82f6"

2. **Sent**
   - name: "Sent"
   - icon: "send"
   - color: "#10b981"

3. **Drafts**
   - name: "Drafts"
   - icon: "file-edit"
   - color: "#f59e0b"

4. **Spam**
   - name: "Spam"
   - icon: "archive"
   - color: "#ef4444"

5. **Trash**
   - name: "Trash"
   - icon: "trash-2"
   - color: "#6b7280"

---

## Authentication Header Format

All protected endpoints require:
```
Authorization: Bearer {jwt_token}
```

Where `{jwt_token}` is the token received from login/register endpoint.

---

## Data Types

### Email Object
```typescript
{
  id: string;
  user_id: string;
  folder_id?: string;
  thread_id?: string;
  from_email: string;
  from_name?: string;
  to_emails: Array<{ email: string; name?: string }>;
  cc_emails?: Array<{ email: string; name?: string }>;
  bcc_emails?: Array<{ email: string; name?: string }>;
  subject?: string;
  body?: string;
  is_read: boolean;
  is_starred: boolean;
  is_draft: boolean;
  has_attachments: boolean;
  created_at: string; // ISO 8601
  sent_at?: string; // ISO 8601
  updated_at?: string; // ISO 8601
}
```

### Folder Object
```typescript
{
  id: string;
  name: string;
  user_id: string;
  icon?: string;
  color?: string;
  created_at: string; // ISO 8601
  updated_at?: string; // ISO 8601
}
```

### User Object
```typescript
{
  id: string;
  email: string;
  name?: string;
  created_at: string; // ISO 8601
  updated_at?: string; // ISO 8601
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"John"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

### Get Emails
```bash
curl -X GET "http://localhost:3001/api/emails?userId=uuid" \
  -H "Authorization: Bearer token"
```

### Create Email
```bash
curl -X POST http://localhost:3001/api/emails \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id":"uuid",
    "from_email":"sender@example.com",
    "to_emails":[{"email":"recipient@example.com"}],
    "subject":"Test",
    "body":"Hello",
    "is_draft":false
  }'
```

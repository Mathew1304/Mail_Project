# Backend Integration Guide - Email Client Frontend

This frontend is ready to be connected to a MariaDB backend. All fake database dependencies have been removed.

## Architecture Overview

The frontend uses service-based architecture for API calls:

```
Frontend Components
    ↓
Service Layer (emailService, authService, etc.)
    ↓
Backend API (MariaDB)
```

## Services to Implement

### 1. **authService** (`src/lib/authService.ts`)
Handles user authentication and profile management.

**Required API Endpoints:**

```typescript
// User Registration
POST /api/auth/register
Body: {
  email: string;
  password: string;
  name: string;
}
Response: { user: { id, email, name }, token: string }

// User Login
POST /api/auth/login
Body: {
  email: string;
  password: string;
}
Response: { user: { id, email, name }, token: string }

// Get Current User Profile
GET /api/auth/profile
Headers: { Authorization: "Bearer {token}" }
Response: { id, email, name, created_at }

// Logout
POST /api/auth/logout
Headers: { Authorization: "Bearer {token}" }
Response: { success: true }
```

### 2. **emailService** (`src/lib/emailService.ts`)
Handles email CRUD operations.

**Required API Endpoints:**

```typescript
// Create Email (Send or Save Draft)
POST /api/emails
Headers: { Authorization: "Bearer {token}" }
Body: {
  user_id: string;
  folder_id?: string;
  from_email: string;
  from_name?: string;
  to_emails: Array<{ email: string; name?: string }>;
  cc_emails?: Array<{ email: string; name?: string }>;
  bcc_emails?: Array<{ email: string; name?: string }>;
  subject?: string;
  body?: string;
  is_draft: boolean;
  has_attachments: boolean;
  thread_id?: string;
  created_at: string;
  sent_at?: string;
}
Response: { id, ...emailData }

// Get All Emails for User
GET /api/emails?userId={userId}&folderId={folderId}
Headers: { Authorization: "Bearer {token}" }
Response: Array<Email>

// Get Single Email
GET /api/emails/{emailId}
Headers: { Authorization: "Bearer {token}" }
Response: Email

// Update Email
PUT /api/emails/{emailId}
Headers: { Authorization: "Bearer {token}" }
Body: { is_read?: boolean, is_starred?: boolean, folder_id?: string, ... }
Response: Email

// Delete Email
DELETE /api/emails/{emailId}
Headers: { Authorization: "Bearer {token}" }
Response: { success: true }

// Get Drafts
GET /api/emails/drafts?userId={userId}
Headers: { Authorization: "Bearer {token}" }
Response: Array<Email>
```

### 3. **Folder Management** (Part of emailService)

**Required API Endpoints:**

```typescript
// Get All Folders for User
GET /api/folders?userId={userId}
Headers: { Authorization: "Bearer {token}" }
Response: Array<{
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  icon?: string;
  color?: string;
}>

// Create Custom Folder
POST /api/folders
Headers: { Authorization: "Bearer {token}" }
Body: {
  name: string;
  user_id: string;
  icon?: string;
  color?: string;
}
Response: Folder

// Update Folder
PUT /api/folders/{folderId}
Headers: { Authorization: "Bearer {token}" }
Body: { name?: string, icon?: string, color?: string }
Response: Folder

// Delete Folder
DELETE /api/folders/{folderId}
Headers: { Authorization: "Bearer {token}" }
Response: { success: true }
```

## Database Schema (MariaDB)

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Emails Table
```sql
CREATE TABLE emails (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  folder_id VARCHAR(36),
  thread_id VARCHAR(36),
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(255),
  to_emails JSON,
  cc_emails JSON,
  bcc_emails JSON,
  subject VARCHAR(500),
  body LONGTEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  is_draft BOOLEAN DEFAULT FALSE,
  has_attachments BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (folder_id) REFERENCES folders(id),
  INDEX idx_user_id (user_id),
  INDEX idx_folder_id (folder_id),
  INDEX idx_thread_id (thread_id),
  INDEX idx_created_at (created_at)
);
```

### Folders Table
```sql
CREATE TABLE folders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd email-client
npm install
```

### 2. Create Backend API
Your backend should:
- Use MariaDB for data storage
- Implement JWT authentication
- Provide REST API endpoints as specified above
- Handle CORS for frontend requests
- Validate all inputs

### 3. Configure Frontend API Base URL
Create a `.env` file in the project root:
```
VITE_API_BASE_URL=http://localhost:3001
```

Update `src/lib/authService.ts` and `src/lib/emailService.ts` to use this URL.

### 4. Update Service Files

**Example: authService.ts**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const authService = {
  register: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    // Decode JWT to get user info
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  }
};
```

**Example: emailService.ts**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export const emailService = {
  createEmail: async (emailData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/emails`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(emailData)
      });
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  getEmails: async (userId: string, folderId?: string) => {
    try {
      const url = new URL(`${API_BASE_URL}/api/emails`);
      url.searchParams.append('userId', userId);
      if (folderId) url.searchParams.append('folderId', folderId);
      
      const response = await fetch(url, {
        headers: getAuthHeader()
      });
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  updateEmail: async (id: string, updates: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/emails/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  deleteEmail: async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/emails/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  getFolders: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/folders?userId=${userId}`, {
        headers: getAuthHeader()
      });
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: [], error };
    }
  }
};
```

## Features Implemented

- ✅ Email composition with draft support
- ✅ Email threading (Gmail-style)
- ✅ Folder management (Inbox, Sent, Drafts, Spam, Trash)
- ✅ Email search and filtering
- ✅ Star/unstar emails
- ✅ Mark as read/unread
- ✅ Dark mode support
- ✅ Carbon credit gamification
- ✅ P2P email distribution
- ✅ IST timezone support

## Running the Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Notes for Backend Developer

1. **Authentication**: Use JWT tokens. Store token in localStorage on frontend.
2. **CORS**: Enable CORS for frontend domain
3. **Validation**: Validate all inputs on backend
4. **Error Handling**: Return proper HTTP status codes and error messages
5. **Pagination**: Consider implementing pagination for large email lists
6. **Search**: Implement full-text search for emails
7. **Attachments**: Plan for file upload/download handling
8. **Rate Limiting**: Implement rate limiting for API endpoints

## Support

For questions about the frontend implementation, refer to the component files in `src/components/`.

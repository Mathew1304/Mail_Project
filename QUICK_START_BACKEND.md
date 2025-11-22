# Quick Start Guide for Backend Developer

## 🚀 5-Minute Overview

### What You're Getting
A production-ready React email client frontend that needs a MariaDB backend.

### What's Already Done ✅
- UI/UX complete
- All features implemented
- Gmail-style threading
- Dark mode
- IST timezone
- No fake database dependencies

### What You Need to Do
1. Create MariaDB database
2. Implement 15 REST API endpoints
3. Update 2 service files with API calls

---

## 📋 Quick Checklist

### Backend Setup (1-2 hours)
- [ ] Create MariaDB database
- [ ] Create 3 tables (users, emails, folders)
- [ ] Implement authentication (JWT)
- [ ] Implement 15 API endpoints
- [ ] Test with Postman/cURL

### Frontend Integration (30 minutes)
- [ ] Update `src/lib/authService.ts`
- [ ] Update `src/lib/emailService.ts`
- [ ] Create `.env` file
- [ ] Test with frontend

---

## 🗄️ Database Schema (Quick)

```sql
-- Users
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Folders
CREATE TABLE folders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Emails
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (folder_id) REFERENCES folders(id)
);
```

---

## 🔌 API Endpoints (15 Total)

### Auth (4 endpoints)
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
POST   /api/auth/logout
```

### Emails (6 endpoints)
```
POST   /api/emails
GET    /api/emails
GET    /api/emails/{id}
PUT    /api/emails/{id}
DELETE /api/emails/{id}
GET    /api/emails/drafts
```

### Folders (5 endpoints)
```
GET    /api/folders
POST   /api/folders
PUT    /api/folders/{id}
DELETE /api/folders/{id}
```

---

## 📝 Service Implementation Template

### authService.ts
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const authService = {
  register: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await response.json();
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },

  logout: async () => {
    localStorage.removeItem('token');
  }
};
```

### emailService.ts
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export const emailService = {
  createEmail: async (emailData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/emails`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(emailData)
    });
    return response.json();
  },

  getEmails: async (userId: string, folderId?: string) => {
    const url = new URL(`${API_BASE_URL}/api/emails`);
    url.searchParams.append('userId', userId);
    if (folderId) url.searchParams.append('folderId', folderId);
    
    const response = await fetch(url, { headers: getAuthHeader() });
    return { data: await response.json(), error: null };
  },

  updateEmail: async (id: string, updates: any) => {
    const response = await fetch(`${API_BASE_URL}/api/emails/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  deleteEmail: async (id: string) => {
    await fetch(`${API_BASE_URL}/api/emails/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
  },

  getFolders: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/folders?userId=${userId}`, {
      headers: getAuthHeader()
    });
    return { data: await response.json(), error: null };
  }
};
```

---

## 🧪 Testing with cURL

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"John"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Get Emails (replace TOKEN)
curl -X GET "http://localhost:3001/api/emails?userId=uuid" \
  -H "Authorization: Bearer TOKEN"

# Create Email
curl -X POST http://localhost:3001/api/emails \
  -H "Authorization: Bearer TOKEN" \
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

---

## 📚 Full Documentation

For complete details, see:
- `BACKEND_INTEGRATION_GUIDE.md` - Full integration guide
- `API_ENDPOINTS_REFERENCE.md` - Complete API reference
- `README.md` - Project overview

---

## 🎯 Timeline

**Day 1:** Database setup + Auth endpoints (4 endpoints)
**Day 2:** Email endpoints (6 endpoints)
**Day 3:** Folder endpoints (5 endpoints) + Testing
**Day 4:** Frontend integration + Bug fixes

---

## 💡 Tips

1. **Use JWT for authentication** - Store token in localStorage
2. **Enable CORS** - Allow frontend domain
3. **Validate inputs** - Always validate on backend
4. **Use proper HTTP status codes** - 200, 201, 400, 401, 404, 500
5. **Test endpoints** - Use Postman or cURL before frontend testing

---

## 🚀 Ready to Start?

1. Clone the repository
2. Read `BACKEND_INTEGRATION_GUIDE.md`
3. Set up MariaDB
4. Implement endpoints
5. Update service files
6. Test with frontend

**Good luck!** 🎉

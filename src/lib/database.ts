// src/lib/database.ts
// API-backed replacement for the old localStorage dbOperations.
// Exposes the same methods (init, save, createUser, getUser, createEmail, etc.)

type Maybe<T> = T | null;

export interface User {
  id: string;
  email: string;
  full_name?: string;
  password_hash: string;
  storage_used?: number;
  storage_limit?: number;
  created_at?: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  created_at?: string;
}

export interface Email {
  id: string;
  user_id: string;
  folder_id?: string;
  from_email: string;
  from_name?: string;
  to_emails: any[];
  cc_emails: any[];
  bcc_emails: any[];
  subject?: string;
  body?: string;
  is_read: boolean;
  is_starred: boolean;
  is_draft: boolean;
  has_attachments: boolean;
  created_at?: string;
  sent_at?: string;
  labels?: any[];
}

const API_BASE = '/api';

async function safeFetch<T = any>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { ...(init?.headers || {}), 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Request failed ${res.status} ${res.statusText} ${txt}`);
  }
  return (await res.json()) as T;
}

export const initDatabase = async (): Promise<boolean> => {
  // Optionally you can call a health endpoint here; for now just return true.
  return true;
};

export const saveData = async (): Promise<boolean> => {
  // Server persists immediately, so this is a no-op for compatibility.
  return true;
};

// Build the dbOperations object
export const dbOperations = {
  init: initDatabase,
  save: saveData,

  // Users
  createUser: async (user: { id?: string; email: string; full_name?: string; password_hash: string }) => {
    try {
      const payload = { ...user };
      const data = await safeFetch<{ success: boolean; id?: string; error?: any }>(`${API_BASE}/users`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return data;
    } catch (error) {
      console.error('createUser error', error);
      return { success: false, error };
    }
  },

  getUser: async (id: string): Promise<Maybe<User>> => {
    try {
      const data = await safeFetch<User | null>(`${API_BASE}/users/${encodeURIComponent(id)}`);
      return data;
    } catch (error) {
      console.error('getUser error', error);
      return null;
    }
  },

  getUserByEmail: async (email: string): Promise<Maybe<User>> => {
    try {
      const data = await safeFetch<User | null>(`${API_BASE}/users/email/${encodeURIComponent(email)}`);
      return data;
    } catch (error) {
      console.error('getUserByEmail error', error);
      return null;
    }
  },

  updateUser: async (id: string, updates: Partial<User>) => {
    try {
      const existing = await dbOperations.getUser(id);
      const merged = { ...(existing || {}), ...updates, id };
      const res = await safeFetch<{ success: boolean; id?: string }>(`${API_BASE}/users`, {
        method: 'POST',
        body: JSON.stringify(merged),
      });
      return res;
    } catch (error) {
      console.error('updateUser error', error);
      return { success: false, error };
    }
  },

  // Folders
  createFolder: async (folder: { id?: string; user_id: string; name: string }) => {
    try {
      const res = await safeFetch<{ success: boolean; id?: string }>(`${API_BASE}/folders`, {
        method: 'POST',
        body: JSON.stringify(folder),
      });
      return res;
    } catch (error) {
      console.error('createFolder error', error);
      return { success: false, error };
    }
  },

  getFolders: async (userId: string): Promise<Folder[]> => {
    try {
      const rows = await safeFetch<Folder[]>(`${API_BASE}/folders/${encodeURIComponent(userId)}`);
      return rows || [];
    } catch (error) {
      console.error('getFolders error', error);
      return [];
    }
  },

  // Emails
  createEmail: async (email: Partial<Email>) => {
    try {
      const res = await safeFetch<{ success: boolean; id?: string }>(`${API_BASE}/emails`, {
        method: 'POST',
        body: JSON.stringify(email),
      });
      return res;
    } catch (error) {
      console.error('createEmail error', error);
      return { success: false, error };
    }
  },

  updateEmail: async (id: string, updates: Partial<Email>) => {
    try {
      const res = await safeFetch<{ success: boolean }>(`${API_BASE}/email/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return res;
    } catch (error) {
      console.error('updateEmail error', error);
      return { success: false, error };
    }
  },

  deleteEmail: async (id: string) => {
    try {
      const res = await safeFetch<{ success: boolean }>(`${API_BASE}/email/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return res;
    } catch (error) {
      console.error('deleteEmail error', error);
      return { success: false, error };
    }
  },

  getEmails: async (userId: string, folderId?: string): Promise<Email[]> => {
    try {
      let url = `${API_BASE}/emails/${encodeURIComponent(userId)}`;
      if (folderId) url += `?folder=${encodeURIComponent(folderId)}`;
      const rows = await safeFetch<any[]>(url);
      return (rows || []).map((r) => ({
        ...r,
        to_emails: Array.isArray(r.to_emails) ? r.to_emails : JSON.parse(r.to_emails || '[]'),
        cc_emails: Array.isArray(r.cc_emails) ? r.cc_emails : JSON.parse(r.cc_emails || '[]'),
        bcc_emails: Array.isArray(r.bcc_emails) ? r.bcc_emails : JSON.parse(r.bcc_emails || '[]'),
        labels: Array.isArray(r.labels) ? r.labels : JSON.parse(r.labels || '[]'),
      }));
    } catch (error) {
      console.error('getEmails error', error);
      return [];
    }
  },

  getEmail: async (id: string): Promise<Maybe<Email>> => {
    try {
      const r = await safeFetch<any>(`${API_BASE}/email/${encodeURIComponent(id)}`);
      if (!r) return null;
      return {
        ...r,
        to_emails: Array.isArray(r.to_emails) ? r.to_emails : JSON.parse(r.to_emails || '[]'),
        cc_emails: Array.isArray(r.cc_emails) ? r.cc_emails : JSON.parse(r.cc_emails || '[]'),
        bcc_emails: Array.isArray(r.bcc_emails) ? r.bcc_emails : JSON.parse(r.bcc_emails || '[]'),
        labels: Array.isArray(r.labels) ? r.labels : JSON.parse(r.labels || '[]'),
      };
    } catch (error) {
      console.error('getEmail error', error);
      return null;
    }
  },

  getDrafts: async (userId: string): Promise<Email[]> => {
    try {
      const all = await dbOperations.getEmails(userId);
      return all.filter((e) => Boolean(e.is_draft));
    } catch (error) {
      console.error('getDrafts error', error);
      return [];
    }
  }
};

// Export both as named exports and as default
export default dbOperations;
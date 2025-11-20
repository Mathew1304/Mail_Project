// Simple in-memory database using localStorage
interface User {
  id: string;
  email: string;
  full_name?: string;
  password_hash: string;
  storage_used: number; // in bytes
  storage_limit: number; // in bytes (1GB = 1073741824 bytes)
  created_at: string;
}

interface Folder {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

interface Email {
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
  created_at: string;
  sent_at?: string;
  labels?: any[];
}

// In-memory storage
let users: User[] = [];
let folders: Folder[] = [];
let emails: Email[] = [];

// Load data from localStorage
const loadData = () => {
  try {
    const savedUsers = localStorage.getItem('emailApp_users');
    const savedFolders = localStorage.getItem('emailApp_folders');
    const savedEmails = localStorage.getItem('emailApp_emails');

    if (savedUsers) users = JSON.parse(savedUsers);
    if (savedFolders) folders = JSON.parse(savedFolders);
    if (savedEmails) emails = JSON.parse(savedEmails);
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
};

// Save data to localStorage
const saveData = () => {
  try {
    localStorage.setItem('emailApp_users', JSON.stringify(users));
    localStorage.setItem('emailApp_folders', JSON.stringify(folders));
    localStorage.setItem('emailApp_emails', JSON.stringify(emails));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

// Initialize database
const initDatabase = async () => {
  loadData();
  console.log('In-memory database initialized successfully');
  return true;
};

// Database operations
export const dbOperations = {
  // Initialize database
  init: initDatabase,
  save: saveData,

  // User operations
  createUser: async (user: { id: string; email: string; full_name?: string; password_hash: string }) => {
    await initDatabase();
    try {
      const existingIndex = users.findIndex(u => u.id === user.id);
      const newUser: User = {
        ...user,
        storage_used: 0,
        storage_limit: 1073741824, // 1GB in bytes
        created_at: new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        users[existingIndex] = newUser;
      } else {
        users.push(newUser);
      }
      
      saveData();
      return { success: true };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error };
    }
  },

  getUser: async (id: string) => {
    await initDatabase();
    try {
      return users.find(u => u.id === id) || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  getUserByEmail: async (email: string) => {
    await initDatabase();
    try {
      return users.find(u => u.email === email) || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  },

  updateUser: async (id: string, updates: Partial<User>) => {
    await initDatabase();
    try {
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex >= 0) {
        users[userIndex] = { ...users[userIndex], ...updates };
        saveData();
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error };
    }
  },

  // Folder operations
  createFolder: async (folder: { id: string; user_id: string; name: string }) => {
    await initDatabase();
    try {
      const existingFolder = folders.find(f => f.id === folder.id);
      if (!existingFolder) {
        const newFolder: Folder = {
          ...folder,
          created_at: new Date().toISOString()
        };
        folders.push(newFolder);
        saveData();
      }
      return { success: true };
    } catch (error) {
      console.error('Error creating folder:', error);
      return { success: false, error };
    }
  },

  getFolders: async (userId: string) => {
    await initDatabase();
    try {
      return folders
        .filter(f => f.user_id === userId)
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error getting folders:', error);
      return [];
    }
  },

  // Email operations
  createEmail: async (email: any) => {
    await initDatabase();
    try {
      const emailId = email.id || crypto.randomUUID();
      const newEmail: Email = {
        id: emailId,
        user_id: email.user_id,
        folder_id: email.folder_id || undefined,
        from_email: email.from_email,
        from_name: email.from_name || undefined,
        to_emails: email.to_emails || [],
        cc_emails: email.cc_emails || [],
        bcc_emails: email.bcc_emails || [],
        subject: email.subject || undefined,
        body: email.body || undefined,
        is_read: Boolean(email.is_read),
        is_starred: Boolean(email.is_starred),
        is_draft: Boolean(email.is_draft),
        has_attachments: Boolean(email.has_attachments),
        created_at: new Date().toISOString(),
        sent_at: email.sent_at || (email.is_draft ? undefined : new Date().toISOString())
      };
      
      emails.push(newEmail);
      saveData();
      return { id: emailId, success: true };
    } catch (error) {
      console.error('Error creating email:', error);
      return { success: false, error };
    }
  },

  updateEmail: async (id: string, updates: any) => {
    await initDatabase();
    try {
      const emailIndex = emails.findIndex(e => e.id === id);
      if (emailIndex >= 0) {
        emails[emailIndex] = { ...emails[emailIndex], ...updates };
        saveData();
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating email:', error);
      return { success: false, error };
    }
  },

  deleteEmail: async (id: string) => {
    await initDatabase();
    try {
      const emailIndex = emails.findIndex(e => e.id === id);
      if (emailIndex >= 0) {
        emails.splice(emailIndex, 1);
        saveData();
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting email:', error);
      return { success: false, error };
    }
  },

  getEmails: async (userId: string, folderId?: string) => {
    await initDatabase();
    try {
      return emails
        .filter(e => {
          if (e.user_id !== userId) return false;
          if (folderId && e.folder_id !== folderId) return false;
          return true;
        })
        .map(email => ({
          ...email,
          // Ensure arrays are properly parsed if they were stored as strings
          to_emails: typeof email.to_emails === 'string' ? JSON.parse(email.to_emails) : (email.to_emails || []),
          cc_emails: typeof email.cc_emails === 'string' ? JSON.parse(email.cc_emails) : (email.cc_emails || []),
          bcc_emails: typeof email.bcc_emails === 'string' ? JSON.parse(email.bcc_emails) : (email.bcc_emails || []),
          labels: email.labels || []
        }))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
      console.error('Error getting emails:', error);
      return [];
    }
  },

  getEmail: async (id: string) => {
    await initDatabase();
    try {
      const email = emails.find(e => e.id === id);
      if (!email) return null;
      
      return {
        ...email,
        // Ensure arrays are properly parsed if they were stored as strings
        to_emails: typeof email.to_emails === 'string' ? JSON.parse(email.to_emails) : (email.to_emails || []),
        cc_emails: typeof email.cc_emails === 'string' ? JSON.parse(email.cc_emails) : (email.cc_emails || []),
        bcc_emails: typeof email.bcc_emails === 'string' ? JSON.parse(email.bcc_emails) : (email.bcc_emails || []),
        labels: email.labels || []
      };
    } catch (error) {
      console.error('Error getting email:', error);
      return null;
    }
  },

  getDrafts: async (userId: string) => {
    await initDatabase();
    try {
      return emails
        .filter(e => e.user_id === userId && e.is_draft)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
      console.error('Error getting drafts:', error);
      return [];
    }
  }
};

export { initDatabase, saveData };
export default { dbOperations, initDatabase, saveData };

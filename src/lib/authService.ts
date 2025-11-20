import { dbOperations } from './database';

// Simple password hashing (in production, use bcrypt or similar)
const hashPassword = (password: string): string => {
  // Simple hash for demo - in production use proper hashing
  return btoa(password + 'salt123');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export const authService = {
  // Register new user
  register: async (email: string, password: string, fullName?: string) => {
    try {
      // Check if user already exists
      const existingUser = await dbOperations.getUserByEmail(email);
      if (existingUser) {
        return { success: false, error: 'User already exists with this email' };
      }

      // Create new user
      const userId = crypto.randomUUID();
      const passwordHash = hashPassword(password);
      
      const result = await dbOperations.createUser({
        id: userId,
        email,
        full_name: fullName,
        password_hash: passwordHash
      });

      if (result.success) {
        // Create default folders for the new user
        const defaultFolders = [
          { id: `${userId}-inbox`, user_id: userId, name: 'Inbox', icon: 'inbox', color: '#3b82f6' },
          { id: `${userId}-sent`, user_id: userId, name: 'Sent', icon: 'send', color: '#10b981' },
          { id: `${userId}-drafts`, user_id: userId, name: 'Drafts', icon: 'file-edit', color: '#f59e0b' },
          { id: `${userId}-spam`, user_id: userId, name: 'Spam', icon: 'archive', color: '#ef4444' },
          { id: `${userId}-trash`, user_id: userId, name: 'Trash', icon: 'trash-2', color: '#6b7280' }
        ];

        for (const folder of defaultFolders) {
          await dbOperations.createFolder(folder);
        }

        // Set current user in localStorage
        const user = await dbOperations.getUser(userId);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        return { success: true, user };
      } else {
        return { success: false, error: 'Failed to create user' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  },

  // Login user
  login: async (email: string, password: string) => {
    try {
      const user = await dbOperations.getUserByEmail(email);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (!verifyPassword(password, user.password_hash)) {
        return { success: false, error: 'Invalid password' };
      }

      // Ensure any dummy data is removed for this user
      try {
        const { removeDummyDataForUser } = await import('./dummyData');
        await removeDummyDataForUser(user.id);
      } catch (cleanupError) {
        console.error('Error cleaning dummy data during login:', cleanupError);
      }

      // Set current user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('currentUser');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return authService.getCurrentUser() !== null;
  },

  // Calculate storage usage for user
  calculateStorageUsage: async (userId: string) => {
    try {
      const emails = await dbOperations.getEmails(userId);
      let totalSize = 0;
      
      emails.forEach(email => {
        // Calculate email size (rough estimation)
        const emailSize = 
          (email.subject?.length || 0) +
          (email.body?.length || 0) +
          (email.from_email?.length || 0) +
          (email.from_name?.length || 0) +
          JSON.stringify(email.to_emails || []).length +
          JSON.stringify(email.cc_emails || []).length +
          JSON.stringify(email.bcc_emails || []).length;
        
        totalSize += emailSize;
      });

      return totalSize;
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return 0;
    }
  },

  // Update user storage usage
  updateStorageUsage: async (userId: string) => {
    try {
      const storageUsed = await authService.calculateStorageUsage(userId);
      const user = await dbOperations.getUser(userId);
      
      if (user) {
        await dbOperations.updateUser(userId, { storage_used: storageUsed });
        
        // Update localStorage if this is the current user
        const currentUser = authService.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          const updatedUser = { ...currentUser, storage_used: storageUsed };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Error updating storage usage:', error);
    }
  }
};

export default authService;

// Email Service - Ready for Backend Integration
// Replace these functions with actual API calls to your MariaDB backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export const emailService = {
  // Email operations
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
      console.error('Error creating email:', error);
      return { data: null, error };
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
      console.error('Error updating email:', error);
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
      console.error('Error deleting email:', error);
      return { error };
    }
  },

  getEmails: async (userId: string, folderId?: string) => {
    try {
      const url = new URL(`${API_BASE_URL}/api/emails`);
      url.searchParams.append('userId', userId);
      if (folderId) url.searchParams.append('folderId', folderId);
      
      const response = await fetch(url, { headers: getAuthHeader() });
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error getting emails:', error);
      return { data: [], error };
    }
  },

  getDrafts: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/emails/drafts?userId=${userId}`, {
        headers: getAuthHeader()
      });
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error getting drafts:', error);
      return { data: [], error };
    }
  },

  // Folder operations
  getFolders: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/folders?userId=${userId}`, {
        headers: getAuthHeader()
      });
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error('Error getting folders:', error);
      return { data: [], error };
    }
  }
};

export default emailService;

import { dbOperations } from './database';

export const emailService = {

  // Email operations
  createEmail: async (emailData: any) => {
    try {
      const emailId = crypto.randomUUID();
      const result = await dbOperations.createEmail({
        ...emailData,
        id: emailId,
      });
      
      if (result.success) {
        // Get the created email
        const email = await dbOperations.getEmail(emailId);
        return { data: email, error: null };
      } else {
        return { data: null, error: result.error };
      }
    } catch (error) {
      console.error('Error creating email:', error);
      return { data: null, error };
    }
  },

  updateEmail: async (id: string, updates: any) => {
    try {
      // Convert arrays to JSON strings for storage
      const processedUpdates = { ...updates };
      if (processedUpdates.to_emails) {
        processedUpdates.to_emails = JSON.stringify(processedUpdates.to_emails);
      }
      if (processedUpdates.cc_emails) {
        processedUpdates.cc_emails = JSON.stringify(processedUpdates.cc_emails);
      }
      if (processedUpdates.bcc_emails) {
        processedUpdates.bcc_emails = JSON.stringify(processedUpdates.bcc_emails);
      }

      const result = await dbOperations.updateEmail(id, processedUpdates);
      if (result.success) {
        const email = await dbOperations.getEmail(id);
        return { data: email, error: null };
      } else {
        return { data: null, error: result.error };
      }
    } catch (error) {
      console.error('Error updating email:', error);
      return { data: null, error };
    }
  },

  deleteEmail: async (id: string) => {
    try {
      const result = await dbOperations.deleteEmail(id);
      return { error: result.success ? null : result.error };
    } catch (error) {
      console.error('Error deleting email:', error);
      return { error };
    }
  },

  getEmails: async (userId: string, folderId?: string) => {
    try {
      const emails = await dbOperations.getEmails(userId, folderId);
      return { data: emails, error: null };
    } catch (error) {
      console.error('Error getting emails:', error);
      return { data: [], error };
    }
  },

  getDrafts: async (userId: string) => {
    try {
      const drafts = await dbOperations.getDrafts(userId);
      return { data: drafts, error: null };
    } catch (error) {
      console.error('Error getting drafts:', error);
      return { data: [], error };
    }
  },

  // Folder operations
  getFolders: async (userId: string) => {
    try {
      const folders = await dbOperations.getFolders(userId);
      return { data: folders, error: null };
    } catch (error) {
      console.error('Error getting folders:', error);
      return { data: [], error };
    }
  }
};

export default emailService;

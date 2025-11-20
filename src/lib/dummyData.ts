import { dbOperations } from './database';

const DUMMY_SENDERS = [
  'welcome@jeemail.com',
  'support@example.com',
  'newsletter@techblog.com',
  'notifications@github.com',
  'team@company.com',
  'billing@service.com',
  'security@bank.com',
  'noreply@shopping.com'
];

const DUMMY_DRAFT_SUBJECTS = [
  'Weekend Plans',
  'Project Update Request'
];

export const addDummyDataForUser = async (userId: string, userEmail: string, userName?: string) => {
  try {
    // Get user's folders
    const folders = await dbOperations.getFolders(userId);
    const inboxFolder = folders.find(f => f.name.toLowerCase() === 'inbox');
    const draftsFolder = folders.find(f => f.name.toLowerCase() === 'drafts');

    if (!inboxFolder || !draftsFolder) {
      console.error('Required folders not found for user');
      return;
    }

    // Add 8 dummy emails to inbox
    const dummyEmails = [
      {
        id: crypto.randomUUID(),
        user_id: userId,
        folder_id: inboxFolder.id,
        from_email: 'welcome@jeemail.com',
        from_name: 'Jeemail Team',
        to_emails: [{ email: userEmail, name: userName || 'User' }],
        cc_emails: [],
        bcc_emails: [],
        subject: 'Welcome to Jeemail! 🎉',
        body: 'Welcome to your new email account! You have 1GB of storage space to manage all your emails, drafts, and attachments. Start composing your first email!',
        is_read: false,
        is_starred: false,
        is_draft: false,
        has_attachments: false,
        created_at: new Date().toISOString(),
        sent_at: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        folder_id: inboxFolder.id,
        from_email: 'support@example.com',
        from_name: 'Support Team',
        to_emails: [{ email: userEmail, name: userName || 'User' }],
        cc_emails: [],
        bcc_emails: [],
        subject: 'Getting Started Guide',
        body: 'Here are some tips to get you started:\n\n1. Click "Compose" to write a new email\n2. Drafts are automatically saved as you type\n3. Use folders to organize your emails\n4. Check your storage usage in the bottom left\n\nHappy emailing!',
        is_read: false,
        is_starred: true,
        is_draft: false,
        has_attachments: false,
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        sent_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        folder_id: inboxFolder.id,
        from_email: 'newsletter@techblog.com',
        from_name: 'Tech Blog',
        to_emails: [{ email: userEmail, name: userName || 'User' }],
        cc_emails: [],
        bcc_emails: [],
        subject: 'Latest Tech News & Updates',
        body: 'Stay updated with the latest technology trends, programming tips, and industry news. This week we cover:\n\n• AI developments\n• Web development trends\n• Mobile app innovations\n• Cloud computing updates\n\nRead more on our website!',
        is_read: true,
        is_starred: false,
        is_draft: false,
        has_attachments: false,
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        sent_at: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        folder_id: inboxFolder.id,
        from_email: 'notifications@github.com',
        from_name: 'GitHub',
        to_emails: [{ email: userEmail, name: userName || 'User' }],
        cc_emails: [],
        bcc_emails: [],
        subject: 'New pull request on your repository',
        body: 'A new pull request has been opened on your repository "awesome-project".\n\nTitle: Fix bug in authentication module\nAuthor: contributor123\n\nPlease review the changes and provide feedback.',
        is_read: false,
        is_starred: false,
        is_draft: false,
        has_attachments: false,
        created_at: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        sent_at: new Date(Date.now() - 10800000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        folder_id: inboxFolder.id,
        from_email: 'team@company.com',
        from_name: 'Project Team',
        to_emails: [{ email: userEmail, name: userName || 'User' }],
        cc_emails: [],
        bcc_emails: [],
        subject: 'Weekly Team Meeting - Tomorrow 2 PM',
        body: 'Hi team,\n\nReminder about our weekly meeting tomorrow at 2 PM.\n\nAgenda:\n- Project updates\n- Sprint planning\n- Q&A session\n\nMeeting link will be shared 15 minutes before.\n\nBest regards,\nTeam Lead',
        is_read: true,
        is_starred: true,
        is_draft: false,
        has_attachments: false,
        created_at: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
        sent_at: new Date(Date.now() - 14400000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        folder_id: inboxFolder.id,
        from_email: 'billing@service.com',
        from_name: 'Billing Department',
        to_emails: [{ email: userEmail, name: userName || 'User' }],
        cc_emails: [],
        bcc_emails: [],
        subject: 'Monthly Invoice - November 2024',
        body: 'Dear Customer,\n\nYour monthly invoice for November 2024 is now available.\n\nAmount Due: $29.99\nDue Date: December 1, 2024\n\nPlease log in to your account to view and pay your invoice.\n\nThank you for your business!',
        is_read: false,
        is_starred: false,
        is_draft: false,
        has_attachments: true,
        created_at: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
        sent_at: new Date(Date.now() - 18000000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        folder_id: inboxFolder.id,
        from_email: 'security@bank.com',
        from_name: 'Bank Security',
        to_emails: [{ email: userEmail, name: userName || 'User' }],
        cc_emails: [],
        bcc_emails: [],
        subject: 'Security Alert: New Login Detected',
        body: 'We detected a new login to your account from a new device.\n\nDevice: Chrome on Windows\nLocation: New York, NY\nTime: Today at 10:30 AM\n\nIf this was you, no action is needed. If not, please contact us immediately.\n\nStay secure!',
        is_read: true,
        is_starred: false,
        is_draft: false,
        has_attachments: false,
        created_at: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
        sent_at: new Date(Date.now() - 21600000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        folder_id: inboxFolder.id,
        from_email: 'noreply@shopping.com',
        from_name: 'Online Store',
        to_emails: [{ email: userEmail, name: userName || 'User' }],
        cc_emails: [],
        bcc_emails: [],
        subject: 'Your Order Has Been Shipped! 📦',
        body: 'Great news! Your order #12345 has been shipped and is on its way to you.\n\nTracking Number: 1Z999AA1234567890\nEstimated Delivery: Tomorrow by 8 PM\n\nTrack your package online or through our mobile app.\n\nThank you for shopping with us!',
        is_read: false,
        is_starred: false,
        is_draft: false,
        has_attachments: false,
        created_at: new Date(Date.now() - 25200000).toISOString(), // 7 hours ago
        sent_at: new Date(Date.now() - 25200000).toISOString()
      }
    ];

    // Add 2 dummy drafts
    const dummyDrafts = [
      {
        id: crypto.randomUUID(),
        user_id: userId,
        folder_id: draftsFolder.id,
        from_email: userEmail,
        from_name: userName || 'User',
        to_emails: [{ email: 'friend@example.com', name: 'Friend' }],
        cc_emails: [],
        bcc_emails: [],
        subject: 'Weekend Plans',
        body: 'Hey! Want to grab coffee this weekend? I found this new place...',
        is_read: false,
        is_starred: false,
        is_draft: true,
        has_attachments: false,
        created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        sent_at: undefined
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        folder_id: draftsFolder.id,
        from_email: userEmail,
        from_name: userName || 'User',
        to_emails: [{ email: 'boss@company.com', name: 'Boss' }],
        cc_emails: [],
        bcc_emails: [],
        subject: 'Project Update Request',
        body: 'Hi,\n\nI wanted to provide an update on the current project status...\n\n[Draft in progress]',
        is_read: false,
        is_starred: false,
        is_draft: true,
        has_attachments: false,
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        sent_at: undefined
      }
    ];

    // Create all dummy emails
    for (const email of [...dummyEmails, ...dummyDrafts]) {
      await dbOperations.createEmail(email);
    }

    console.log('Dummy data added successfully for user:', userId);
  } catch (error) {
    console.error('Error adding dummy data:', error);
  }
};

export const removeDummyDataForUser = async (userId: string) => {
  try {
    const emails = await dbOperations.getEmails(userId);
    const lowercaseSenders = new Set(DUMMY_SENDERS.map(sender => sender.toLowerCase()));
    const lowercaseDraftSubjects = new Set(DUMMY_DRAFT_SUBJECTS.map(subject => subject.toLowerCase()));

    for (const email of emails) {
      const isDummySender = lowercaseSenders.has(email.from_email?.toLowerCase?.() || '');
      const isDummyDraft = email.is_draft && lowercaseDraftSubjects.has((email.subject || '').toLowerCase());

      if (isDummySender || isDummyDraft) {
        await dbOperations.deleteEmail(email.id);
      }
    }
  } catch (error) {
    console.error('Error removing dummy data:', error);
  }
};

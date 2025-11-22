import { X, Reply, ReplyAll, Forward, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { emailService } from '../lib/emailService';
import { threadingService } from '../lib/threadingService';
import { authService } from '../lib/authService';

interface ThreadEmail {
  id: string;
  thread_id?: string;
  subject?: string;
  from_email: string;
  from_name?: string;
  to_emails: any[];
  cc_emails: any[];
  bcc_emails: any[];
  body?: string;
  created_at?: string;
  sent_at?: string;
  is_read: boolean;
  is_starred: boolean;
  is_draft: boolean;
}

interface ThreadViewProps {
  threadId: string;
  userId: string;
  onClose: () => void;
  onCompose?: (data: {
    to?: string;
    cc?: string;
    subject?: string;
    body?: string;
    threadId?: string;
    isReply?: boolean;
    isForward?: boolean;
  }) => void;
}

export default function ThreadView({ threadId, userId, onClose, onCompose }: ThreadViewProps) {
  const [emails, setEmails] = useState<ThreadEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set());

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    loadThread();
  }, [threadId]);

  const loadThread = async () => {
    setLoading(true);
    try {
      const { data: allEmails } = await emailService.getEmails(userId);
      if (allEmails) {
        // Filter emails in this thread and sort by date ascending (oldest first)
        const threadEmails = allEmails
          .filter((email: any) => email.thread_id === threadId)
          .sort((a: any, b: any) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        
        setEmails(threadEmails);
        // Expand only the last email by default
        if (threadEmails.length > 0) {
          setExpandedEmails(new Set([threadEmails[threadEmails.length - 1].id]));
        }
      }
    } catch (error) {
      console.error('Error loading thread:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmailExpanded = (emailId: string) => {
    const newExpanded = new Set(expandedEmails);
    if (newExpanded.has(emailId)) {
      newExpanded.delete(emailId);
    } else {
      newExpanded.add(emailId);
    }
    setExpandedEmails(newExpanded);
  };

  const handleReply = (email: ThreadEmail) => {
    if (!currentUser || !onCompose) return;
    
    const replySubject = email.subject?.startsWith('Re:') ? email.subject : `Re: ${email.subject || '(No subject)'}`;
    const replyBody = `\n\n--- Original Message ---\nFrom: ${email.from_name || email.from_email}\nTo: ${email.to_emails?.map(to => to.email).join(', ') || 'me'}\nSubject: ${email.subject || '(No subject)'}\n\n${email.body || ''}`;
    
    onCompose({ 
      to: email.from_email, 
      subject: replySubject, 
      body: replyBody,
      threadId: threadId,
      isReply: true
    });
  };

  const handleReplyAll = (email: ThreadEmail) => {
    if (!currentUser || !onCompose) return;
    
    const allRecipients = [email.from_email, ...(email.to_emails?.map(to => to.email) || []), ...(email.cc_emails?.map(cc => cc.email) || [])]
      .filter(emailAddr => emailAddr !== currentUser.email);
    
    const replySubject = email.subject?.startsWith('Re:') ? email.subject : `Re: ${email.subject || '(No subject)'}`;
    const replyBody = `\n\n--- Original Message ---\nFrom: ${email.from_name || email.from_email}\nTo: ${email.to_emails?.map(to => to.email).join(', ') || 'me'}\nSubject: ${email.subject || '(No subject)'}\n\n${email.body || ''}`;
    
    onCompose({ 
      to: allRecipients.join(', '), 
      subject: replySubject, 
      body: replyBody,
      threadId: threadId,
      isReply: true
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Get today's date in IST
    const istFormatter = new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
    
    const nowFormatter = new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
    
    const now = new Date();
    const todayParts = nowFormatter.formatToParts(now);
    const dateParts = istFormatter.formatToParts(date);
    
    const todayStr = `${todayParts.find(p => p.type === 'year')?.value}-${todayParts.find(p => p.type === 'month')?.value}-${todayParts.find(p => p.type === 'day')?.value}`;
    const dateStr = `${dateParts.find(p => p.type === 'year')?.value}-${dateParts.find(p => p.type === 'month')?.value}-${dateParts.find(p => p.type === 'day')?.value}`;
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatter = new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
    const yesterdayParts = yesterdayFormatter.formatToParts(yesterday);
    const yesterdayStr = `${yesterdayParts.find(p => p.type === 'year')?.value}-${yesterdayParts.find(p => p.type === 'month')?.value}-${yesterdayParts.find(p => p.type === 'day')?.value}`;

    if (dateStr === todayStr) {
      // Today: show time in 12-hour format with AM/PM
      return date.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      });
    } else if (dateStr === yesterdayStr) {
      return 'Yesterday';
    } else if (dateParts.find(p => p.type === 'year')?.value === todayParts.find(p => p.type === 'year')?.value) {
      return date.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric',
        timeZone: 'Asia/Kolkata',
      });
    } else {
      return date.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric', 
        year: '2-digit',
        timeZone: 'Asia/Kolkata',
      });
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading thread...</div>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">No emails in this thread</div>
      </div>
    );
  }

  const firstEmail = emails[0];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {threadingService.getBaseSubject(firstEmail?.subject || '')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {emails.length} message{emails.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Thread Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {emails.map((email, index) => {
            const isExpanded = expandedEmails.has(email.id);
            const isLast = index === emails.length - 1;

            return (
              <div key={email.id} className={isLast ? '' : 'bg-gray-50 dark:bg-gray-800/30'}>
                {/* Email Header - Always Visible */}
                <button
                  onClick={() => toggleEmailExpanded(email.id)}
                  className="w-full text-left p-4 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors flex items-center gap-3"
                >
                  <ChevronRight
                    size={18}
                    className={`text-gray-400 flex-shrink-0 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {email.from_name || email.from_email}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        &lt;{email.from_email}&gt;
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>to {email.to_emails?.map((t: any) => t.email).join(', ') || 'me'}</span>
                      <span>•</span>
                      <span>{formatDate(email.created_at || email.sent_at || '')}</span>
                    </div>
                  </div>
                </button>

                {/* Email Body - Expandable */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-0 border-t border-gray-200 dark:border-gray-700">
                    {/* Full sender info when expanded */}
                    <div className="mb-6 pt-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {(email.from_name || email.from_email).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {email.from_name || email.from_email}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            &lt;{email.from_email}&gt;
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            to {email.to_emails?.map((t: any) => t.email).join(', ') || 'me'}
                            {email.cc_emails && email.cc_emails.length > 0 && (
                              <span>, cc {email.cc_emails.map((cc: any) => cc.email).join(', ')}</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {new Date(email.created_at || email.sent_at || '').toLocaleString('en-IN', {
                              timeZone: 'Asia/Kolkata',
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email Body */}
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed mb-6 text-sm">
                      {email.body || '(No content)'}
                    </div>

                    {/* Action Buttons - Only on last email */}
                    {isLast && (
                      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => handleReply(email)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Reply size={16} />
                          Reply
                        </button>
                        <button
                          onClick={() => handleReplyAll(email)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <ReplyAll size={16} />
                          Reply All
                        </button>
                        <button
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Forward size={16} />
                          Forward
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Inbox, Send, FileEdit, Trash2, Plus, Star, Archive,
  Search, LogOut, Sparkles, Circle, X, ChevronDown, User
} from 'lucide-react';
import { emailService } from '../lib/emailService';
import { authService } from '../lib/authService';
import EmailList from './EmailList';
import EmailView from './EmailView';
import ThreadView from './ThreadView';
import ComposeEmail from './ComposeEmail';
import ThemeToggle from './ThemeToggle';
import GamificationBadges from './GamificationBadges';
import UserProfile from './UserProfile';
import { animations } from '../utils/animations';

const iconMap: Record<string, typeof Inbox> = {
  inbox: Inbox,
  send: Send,
  'file-edit': FileEdit,
  'trash-2': Trash2,
  archive: Archive,
  star: Star,
  circle: Circle,
  folder: Circle,
  drafts: FileEdit,
  sent: Send,
  spam: Archive,
  trash: Trash2,
};

// Define types
interface Folder {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  icon?: string;
  color?: string;
}

interface Email {
  id: string;
  user_id: string;
  folder_id?: string;
  thread_id?: string;
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

export default function MailLayout() {
  const profile = authService.getCurrentUser();
  const signOut = () => {
    authService.logout();
    window.location.reload();
  };
  
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [composeData, setComposeData] = useState<{
    to?: string;
    cc?: string;
    subject?: string;
    body?: string;
    threadId?: string;
    isReply?: boolean;
    isForward?: boolean;
  } | undefined>(undefined);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showBadges, setShowBadges] = useState(true);
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;

    const initializeUserData = async () => {
      try {
        loadFolders();
        loadEmails();
      } catch (error) {
        console.error('Error initializing user data:', error);
      }
    };

    initializeUserData();
  }, [profile?.id]);

  useEffect(() => {
    if (selectedFolder) {
      loadEmails(selectedFolder.id);
    }
  }, [selectedFolder]);

  useEffect(() => {
    if (folders.length > 0 && !selectedFolder) {
      const inboxFolder = folders.find(f => f.name.toLowerCase() === 'inbox');
      if (inboxFolder) {
        setSelectedFolder(inboxFolder);
      }
    }
  }, [folders, selectedFolder]);

  const loadFolders = async () => {
    try {
      const { data, error } = await emailService.getFolders(profile.id);

      if (error) throw error;
      
      // If we got data from backend, use it
      if (data && data.length > 0) {
        setFolders(data);
        setSelectedFolder(data[0]);
      } else {
        // Fallback to default folders if backend is not connected
        const defaultFolders = [
          { id: 'inbox', user_id: profile.id, name: 'Inbox', icon: 'inbox', color: '#3b82f6', created_at: new Date().toISOString() },
          { id: 'sent', user_id: profile.id, name: 'Sent', icon: 'send', color: '#10b981', created_at: new Date().toISOString() },
          { id: 'drafts', user_id: profile.id, name: 'Drafts', icon: 'file-edit', color: '#f59e0b', created_at: new Date().toISOString() },
          { id: 'spam', user_id: profile.id, name: 'Spam', icon: 'archive', color: '#ef4444', created_at: new Date().toISOString() },
          { id: 'trash', user_id: profile.id, name: 'Trash', icon: 'trash-2', color: '#6b7280', created_at: new Date().toISOString() }
        ];
        setFolders(defaultFolders);
        setSelectedFolder(defaultFolders[0]);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
      // If there's an error (backend not connected), show default folders
      const defaultFolders = [
        { id: 'inbox', user_id: profile.id, name: 'Inbox', icon: 'inbox', color: '#3b82f6', created_at: new Date().toISOString() },
        { id: 'sent', user_id: profile.id, name: 'Sent', icon: 'send', color: '#10b981', created_at: new Date().toISOString() },
        { id: 'drafts', user_id: profile.id, name: 'Drafts', icon: 'file-edit', color: '#f59e0b', created_at: new Date().toISOString() },
        { id: 'spam', user_id: profile.id, name: 'Spam', icon: 'archive', color: '#ef4444', created_at: new Date().toISOString() },
        { id: 'trash', user_id: profile.id, name: 'Trash', icon: 'trash-2', color: '#6b7280', created_at: new Date().toISOString() }
      ];
      setFolders(defaultFolders);
      setSelectedFolder(defaultFolders[0]);
    } finally {
      setLoading(false);
    }
  };

  const loadEmails = async (folderId?: string) => {
    try {
      const { data, error } = await emailService.getEmails(profile.id, folderId);

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error loading emails:', error);
    }
  };

  // Function to refresh all emails (including drafts)
  const refreshEmails = () => {
    if (selectedFolder) {
      loadEmails(selectedFolder.id);
    } else {
      // Load all emails if no folder is selected
      loadEmails();
    }
  };

  // Handle compose with pre-filled data (reply/forward)
  const handleCompose = (data?: {
    to?: string;
    cc?: string;
    subject?: string;
    body?: string;
    threadId?: string;
    isReply?: boolean;
    isForward?: boolean;
  }) => {
    setComposeData(data);
    setShowCompose(true);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showProfileDropdown) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileDropdown]);


  const filteredEmails = emails.filter(email => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (email.subject || '').toLowerCase().includes(query) ||
      (email.from_name || '').toLowerCase().includes(query) ||
      email.from_email.toLowerCase().includes(query) ||
      (email.body || '').toLowerCase().includes(query)
    );
  });


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-slate-950 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 dark:text-white font-bold text-lg">Jeemail</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="relative flex-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileDropdown(!showProfileDropdown);
                }}
                className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                    {profile?.email}
                  </p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden ${animations.slideInUp}`} style={{ minWidth: '320px' }}>
                  {/* User Info Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xl relative">
                        {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Hi, {profile?.full_name || 'User'}!
                        </p>
                        <p className="text-xs text-gray-600 dark:text-slate-400 truncate">
                          {profile?.email}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowProfileDropdown(false)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Manage Account Button */}
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        setShowUserProfile(true);
                        setShowProfileDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition border border-blue-200 dark:border-blue-800 mb-2 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      View Profile & Carbon Credits
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="p-2 space-y-1">
                    <button className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-3">
                      <Plus className="w-4 h-4 text-blue-500" />
                      Add account
                    </button>
                    <button
                      onClick={signOut}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4 text-gray-500" />
                      Sign out
                    </button>
                  </div>

                  {/* Storage Info */}
                  <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      <span>8% of 1 GB used</span>
                    </div>
                  </div>

                  {/* Footer Links */}
                  <div className="p-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                    <div className="flex justify-center gap-4 text-xs text-gray-500 dark:text-slate-500">
                      <button className="hover:text-gray-700 dark:hover:text-slate-300 transition">Privacy Policy</button>
                      <span>•</span>
                      <button className="hover:text-gray-700 dark:hover:text-slate-300 transition">Terms of Service</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Compose Button */}
        <div className="p-4">
          <button
            onClick={() => handleCompose()}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 ${animations.fadeInUp}`}
          >
            <Plus className="w-4 h-4" />
            Compose
          </button>
        </div>

        {/* Folders */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-2 space-y-1">
            {/* Reorder folders: Inbox, Drafts, Sent, Spam, Trash */}
            {['inbox', 'drafts', 'sent', 'spam', 'trash'].map((folderType) => {
              const folder = folders.find(f => f.name.toLowerCase() === folderType);
              if (!folder) return null;
              
              const Icon = iconMap[folderType] || iconMap[folder.icon || 'folder'] || Circle;
              const isActive = selectedFolder?.id === folder.id;
              const folderUnread = emails.filter(e =>
                e.folder_id === folder.id && !e.is_read
              ).length;

              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${animations.fadeInLeft} ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" style={{ color: folder.color || (isActive ? '#1e40af' : undefined) }} />
                  <span className="flex-1 text-left font-medium text-sm">{folder.name}</span>
                  {folderUnread > 0 && (
                    <span className={`bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center flex-shrink-0 ${animations.pulseGlow}`}>
                      {folderUnread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gamification Badges Section */}
        <div className="border-t border-gray-200 dark:border-slate-800 p-4">
          <button
            onClick={() => setShowBadges(!showBadges)}
            className="flex items-center justify-between w-full mb-3 hover:opacity-80 transition"
          >
            <h3 className="text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
              🏆 Achievements
            </h3>
            <ChevronDown 
              className={`w-4 h-4 text-gray-500 dark:text-slate-400 transition-transform ${showBadges ? 'rotate-180' : ''}`}
            />
          </button>
          {showBadges && (
            <div className="max-h-96 overflow-y-auto">
              <GamificationBadges />
            </div>
          )}
        </div>

        {/* Storage Usage - Bottom Left */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-400 mb-2">
              <span>Storage Used</span>
              <span>
                {((profile?.storage_used || 0) / (1024 * 1024)).toFixed(1)} MB / 1024 MB
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(((profile?.storage_used || 0) / (profile?.storage_limit || 1073741824)) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center px-6 gap-4">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emails..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition">
              <Star className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition">
              <Archive className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 flex overflow-hidden">
          <EmailList
            emails={filteredEmails}
            selectedEmail={selectedEmail}
            onSelectEmail={(email) => {
              setSelectedEmail(email);
              // If email has thread_id, show thread view
              if (email.thread_id) {
                setSelectedThreadId(email.thread_id);
              } else {
                setSelectedThreadId(null);
              }
            }}
            onRefresh={() => selectedFolder && loadEmails(selectedFolder.id)}
          />
          {selectedThreadId ? (
            <ThreadView
              threadId={selectedThreadId}
              userId={profile?.id || ''}
              onClose={() => {
                setSelectedThreadId(null);
                setSelectedEmail(null);
              }}
              onCompose={handleCompose}
            />
          ) : (
            <EmailView
              email={selectedEmail}
              onClose={() => setSelectedEmail(null)}
              onRefresh={() => selectedFolder && loadEmails(selectedFolder.id)}
              onCompose={handleCompose}
            />
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <ComposeEmail
          onClose={() => {
            setShowCompose(false);
            setComposeData(undefined);
          }}
          onSent={() => {
            setShowCompose(false);
            setComposeData(undefined);
            refreshEmails();
          }}
          onDraftSaved={refreshEmails}
          prefilledData={composeData}
        />
      )}

      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfile
          onClose={() => setShowUserProfile(false)}
          userEmail={profile?.email}
          userName={profile?.full_name || profile?.email}
        />
      )}
    </div>
  );
}

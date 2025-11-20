import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
};

export type Folder = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  position: number;
  is_system: boolean;
  created_at: string;
};

export type Email = {
  id: string;
  user_id: string;
  folder_id: string | null;
  thread_id: string | null;
  from_email: string;
  from_name: string;
  to_emails: Array<{ email: string; name: string }>;
  cc_emails: Array<{ email: string; name: string }>;
  bcc_emails: Array<{ email: string; name: string }>;
  subject: string;
  body: string;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  has_attachments: boolean;
  labels: Array<{ name: string; color: string }>;
  sent_at: string;
  created_at: string;
};

export type Attachment = {
  id: string;
  email_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  created_at: string;
};

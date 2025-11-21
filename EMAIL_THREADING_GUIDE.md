# Email Threading System Guide

## Overview

Email threading automatically groups related emails (replies, forwards, and original messages) into organized conversations. This makes it easier to follow email discussions and maintain context.

## How Threading Works

### Thread ID Generation

Each thread is identified by a unique `thread_id` that is generated based on:
- **Normalized Subject**: The base subject without "Re:", "Fwd:", or other prefixes
- **Participants**: All email addresses involved in the conversation (sorted for consistency)

```
thread_id = hash(normalized_subject + sorted_participants)
```

### Thread Types

#### 1. **Reply Thread**
- **Trigger**: User clicks "Reply" or "Reply All" button
- **Subject**: Automatically prefixed with "Re:" if not already present
- **Thread ID**: Inherits from original email's thread_id
- **Body**: Includes quoted original message
- **Participants**: Same as original conversation

**Example**:
```
Original: "Project Update"
Reply:    "Re: Project Update"
```

#### 2. **Forward Thread**
- **Trigger**: User clicks "Forward" button
- **Subject**: Automatically prefixed with "Fwd:" if not already present
- **Thread ID**: New thread (separate from original)
- **Body**: Includes forwarded message with metadata
- **Participants**: New recipients

**Example**:
```
Original: "Project Update"
Forward:  "Fwd: Project Update"
```

### Thread Grouping

All emails with the same `thread_id` are automatically grouped together in the UI:

```
Thread: "Project Update"
├── Original Email (from: john@example.com)
├── Reply 1 (from: jane@example.com)
├── Reply 2 (from: john@example.com)
└── Reply 3 (from: jane@example.com)
```

## Database Schema

### Emails Table Addition

```sql
ALTER TABLE emails ADD COLUMN thread_id TEXT;
```

**Fields**:
- `thread_id` (TEXT, nullable): Unique identifier for the email thread
- All other email fields remain unchanged

## API & Services

### threadingService

Located at: `src/lib/threadingService.ts`

#### Methods

##### `generateThreadId(subject: string, participants: string[]): string`
Generates a unique thread ID from subject and participants.

```typescript
const participants = ['john@example.com', 'jane@example.com'];
const threadId = threadingService.generateThreadId('Project Update', participants);
// Returns: "thread_abc123..."
```

##### `getParticipants(email: Email): string[]`
Extracts all email addresses from an email (from, to, cc).

```typescript
const participants = threadingService.getParticipants(email);
// Returns: ['john@example.com', 'jane@example.com', 'bob@example.com']
```

##### `isReply(subject: string): boolean`
Checks if email subject indicates a reply.

```typescript
threadingService.isReply('Re: Project Update'); // true
threadingService.isReply('Project Update');      // false
```

##### `isForward(subject: string): boolean`
Checks if email subject indicates a forward.

```typescript
threadingService.isForward('Fwd: Project Update'); // true
threadingService.isForward('Project Update');      // false
```

##### `getBaseSubject(subject: string): string`
Removes reply/forward prefixes from subject.

```typescript
threadingService.getBaseSubject('Re: Project Update');   // 'Project Update'
threadingService.getBaseSubject('Fwd: Project Update');  // 'Project Update'
```

##### `createReply(...): Promise<EmailResult>`
Creates a reply email with threading.

```typescript
const result = await threadingService.createReply(
  originalEmail,
  replyBody,
  userId,
  userEmail,
  toEmails,
  ccEmails
);
```

##### `createForward(...): Promise<EmailResult>`
Creates a forward email with new threading.

```typescript
const result = await threadingService.createForward(
  originalEmail,
  forwardBody,
  userId,
  userEmail,
  toEmails,
  ccEmails
);
```

##### `getThread(threadId: string, userId: string): Promise<EmailThread>`
Retrieves all emails in a thread.

```typescript
const thread = await threadingService.getThread(threadId, userId);
// Returns: { thread_id, subject, emails[], unread_count, last_email_date }
```

##### `getThreads(userId: string): Promise<EmailThread[]>`
Retrieves all threads for a user.

```typescript
const threads = await threadingService.getThreads(userId);
// Returns: Array of EmailThread objects, sorted by most recent
```

##### `markThreadAsRead(threadId: string, userId: string): Promise<boolean>`
Marks all emails in a thread as read.

```typescript
await threadingService.markThreadAsRead(threadId, userId);
```

##### `starThread(threadId: string, userId: string, starred: boolean): Promise<boolean>`
Stars/unstars all emails in a thread.

```typescript
await threadingService.starThread(threadId, userId, true);
```

## Component Integration

### EmailView Component

When user clicks Reply/Reply All/Forward:

```typescript
const handleReply = () => {
  // Generate thread ID
  const participants = threadingService.getParticipants(email);
  const threadId = email.thread_id || 
    threadingService.generateThreadId(email.subject || '', participants);
  
  // Pass to compose
  onCompose({ 
    to: email.from_email, 
    subject: `Re: ${email.subject}`,
    body: originalMessageQuote,
    threadId: threadId,
    isReply: true
  });
};
```

### ComposeEmail Component

Receives threading data and includes in email:

```typescript
await emailService.createEmail({
  user_id: profile.id,
  from_email: profile.email,
  to_emails: toEmails,
  subject: subject,
  body: body,
  thread_id: threadId,  // ← Threading support
  is_draft: false,
  folder_id: sentFolderId
});
```

## User Experience

### Viewing Threads

1. **Email List**: Shows base subject (without Re:/Fwd: prefixes)
2. **Thread View**: Displays all related emails chronologically
3. **Unread Count**: Shows unread emails in thread
4. **Last Email**: Displays date of most recent email

### Creating Replies

1. User clicks "Reply" on an email
2. Compose window opens with:
   - Pre-filled recipient (original sender)
   - Subject: "Re: Original Subject"
   - Body: Quoted original message
   - Thread ID: Inherited from original
3. User types reply and sends
4. Reply automatically added to same thread

### Creating Forwards

1. User clicks "Forward" on an email
2. Compose window opens with:
   - Empty recipient field
   - Subject: "Fwd: Original Subject"
   - Body: Forwarded message with metadata
   - New thread ID: Generated for new recipients
3. User enters new recipients and sends
4. Forward creates new thread

## Data Flow

```
User clicks Reply
    ↓
EmailView.handleReply()
    ↓
Generate/inherit thread_id
    ↓
Pass to ComposeEmail with threadId
    ↓
User sends email
    ↓
ComposeEmail.handleSend()
    ↓
emailService.createEmail({ thread_id: threadId, ... })
    ↓
Email saved with thread_id
    ↓
UI groups with other emails in same thread
```

## Thread ID Examples

### Example 1: Simple Reply Chain

```
Original Email:
- Subject: "Meeting Tomorrow"
- From: john@example.com
- To: jane@example.com
- thread_id: "thread_abc123"

Reply 1:
- Subject: "Re: Meeting Tomorrow"
- From: jane@example.com
- To: john@example.com
- thread_id: "thread_abc123" (same)

Reply 2:
- Subject: "Re: Meeting Tomorrow"
- From: john@example.com
- To: jane@example.com
- thread_id: "thread_abc123" (same)
```

### Example 2: Forward Creates New Thread

```
Original Email:
- Subject: "Project Proposal"
- From: john@example.com
- To: jane@example.com
- thread_id: "thread_xyz789"

Forward:
- Subject: "Fwd: Project Proposal"
- From: jane@example.com
- To: bob@example.com
- thread_id: "thread_new456" (different!)
```

## Best Practices

1. **Always Generate Thread ID for Replies**: Use original email's thread_id if available
2. **Create New Thread for Forwards**: Forwards should have new thread_id
3. **Preserve Participants**: Include all original participants in replies
4. **Sort Chronologically**: Display threads with oldest email first
5. **Show Unread Count**: Highlight threads with unread emails
6. **Mark Thread as Read**: Option to mark entire thread as read at once

## Future Enhancements

- [ ] Thread collapsing/expanding in email list
- [ ] Thread search and filtering
- [ ] Thread labels and tags
- [ ] Thread muting (ignore further replies)
- [ ] Thread archiving
- [ ] Thread export as PDF
- [ ] Thread analytics (response time, participants)
- [ ] Smart threading (detect related emails by content)

## Troubleshooting

### Emails Not Grouping

**Issue**: Replies not appearing in same thread

**Solutions**:
1. Check `thread_id` is being set correctly
2. Verify subject line has "Re:" prefix
3. Ensure participants list is consistent
4. Check database migration was applied

### Duplicate Threads

**Issue**: Same conversation in multiple threads

**Solutions**:
1. Verify thread ID generation is deterministic
2. Check subject normalization removes all prefixes
3. Ensure participants are sorted consistently

### Missing Emails

**Issue**: Some emails not appearing in thread

**Solutions**:
1. Verify all emails have thread_id set
2. Check email isn't in different folder
3. Verify user_id matches
4. Check thread_id matches exactly

## Support

For issues or questions:
1. Check browser console for errors
2. Review server logs
3. Verify database schema includes thread_id column
4. Test with simple reply/forward scenario
5. Contact support with thread_id and email IDs

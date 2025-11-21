# Peer-to-Peer (P2P) Email System Guide

## Overview

The P2P email system enables direct peer-to-peer communication and file transfer between two users without storing files on the server. This is ideal for:
- Sharing large files
- Direct communication between trusted peers
- Reducing server storage requirements
- Real-time file transfer

## How P2P Works

### 1. **Connection Requirements**
Both sender and receiver must:
- ✅ Be logged into the email system
- ✅ Have an active internet connection
- ✅ Be connected to the P2P network
- ✅ Have their browser window open

### 2. **File Transfer Flow**

```
Sender                          P2P Server                      Receiver
  |                                  |                              |
  |------ Register (WebSocket) ----->|                              |
  |                                  |<----- Register (WebSocket) ---|
  |                                  |                              |
  |------ Send Email Metadata ------>|------ Forward to Receiver -->|
  |                                  |                              |
  |------ File Chunks (64KB) ------->|------ Forward Chunks ------->|
  |                                  |                              |
  |------ File Complete Signal ----->|------ Notify Receiver ------>|
  |                                  |                              |
```

### 3. **Key Features**

#### Real-Time Connection
- WebSocket connection between peers
- Instant message delivery
- Automatic reconnection on disconnect

#### File Chunking
- Files split into 64KB chunks
- Efficient bandwidth usage
- Progress tracking for each chunk

#### Peer Discovery
- Automatic peer registration
- Online/offline status tracking
- Peer list broadcasting

#### Message Queuing
- Offline messages stored temporarily
- Delivered when peer comes online
- Max 100 messages per peer

## Using P2P Mode

### Step 1: Enable P2P Mode
1. Open Compose Email
2. Click the **Share2 icon** (P2P button) in the toolbar
3. A menu appears with "Activate P2P Mode"
4. Click the **Info icon** (ℹ️) to see how P2P works
5. Click **"Activate P2P Mode"** button

### Step 2: Prepare Email
1. Enter recipient email address
2. Add subject and message
3. **Attach files** (if needed)
4. P2P mode is now active

### Step 3: Send Email
1. Click **"Send"** button
2. System checks if recipient is online
3. If online: Direct P2P transfer begins
4. If offline: Alert shown, waiting for recipient
5. Progress bar shows transfer status

### Step 4: Receive Email
Recipient will:
1. See P2P email notification
2. Files download directly from sender
3. No server storage needed
4. Email saved in Inbox

## Technical Details

### Frontend (p2pService.ts)
- **WebSocket Client**: Connects to P2P server
- **Message Handling**: Routes messages by type
- **File Chunking**: Splits files into 64KB chunks
- **Progress Tracking**: Real-time transfer updates

### Backend (p2p.js)
- **WebSocket Server**: Manages peer connections
- **Message Routing**: Forwards messages between peers
- **Peer Registry**: Tracks online/offline status
- **Message Queue**: Stores offline messages

### Message Types
```javascript
{
  "register": { userId, userEmail },
  "email": { from, to, subject, body, attachments },
  "file-chunk": { emailId, fileName, chunkIndex, chunk },
  "file-complete": { emailId },
  "peer-online": { userId, email },
  "peer-offline": { email },
  "email-delivered": { emailId }
}
```

## Troubleshooting

### "Recipient is not online"
- ✓ Ask recipient to log in
- ✓ Wait for recipient to connect
- ✓ System will retry automatically

### "P2P connection failed"
- ✓ Check internet connection
- ✓ Verify WebSocket is enabled
- ✓ Check browser console for errors
- ✓ Restart the application

### "File transfer incomplete"
- ✓ Check network stability
- ✓ Verify recipient is still online
- ✓ Try sending again
- ✓ Use regular email for large files

### "WebSocket connection timeout"
- ✓ Increase timeout in p2pService.ts
- ✓ Check server logs
- ✓ Verify P2P server is running

## Performance Considerations

### Bandwidth
- 64KB chunks = ~15 chunks per second on 1Mbps connection
- Large files (>100MB) may take time
- Progress bar shows real-time updates

### Latency
- WebSocket provides low-latency communication
- Typical message delivery: <100ms
- Chunk transfer: Depends on file size and bandwidth

### Server Load
- P2P transfers don't use server bandwidth
- Only metadata passes through server
- Scales well with many users

## Security Notes

### Encryption
- WebSocket connection should use WSS (WebSocket Secure)
- Consider adding end-to-end encryption for sensitive files
- Implement authentication tokens

### Privacy
- Files transferred directly between peers
- No server-side storage of file content
- Only metadata stored for audit trail

### Trust
- Only send files to trusted recipients
- Verify recipient email before sending
- Use regular email for sensitive documents

## Future Enhancements

- [ ] End-to-end encryption (E2EE)
- [ ] File compression before transfer
- [ ] Resume interrupted transfers
- [ ] Multi-peer file sharing
- [ ] Bandwidth throttling
- [ ] File integrity verification (checksums)
- [ ] Automatic retry with exponential backoff
- [ ] P2P network statistics dashboard

## API Reference

### p2pService.connect(userId, userEmail)
Connects to P2P network
```typescript
await p2pService.connect(profile.id, profile.email);
```

### p2pService.sendP2PEmail(recipientEmail, subject, body, attachments, onProgress)
Sends P2P email with files
```typescript
await p2pService.sendP2PEmail(
  'recipient@example.com',
  'Subject',
  'Body text',
  [file1, file2],
  (progress) => console.log(`${progress}%`)
);
```

### p2pService.onEmailReceived(callback)
Listen for incoming P2P emails
```typescript
p2pService.onEmailReceived((email) => {
  console.log('Received:', email);
});
```

### p2pService.getOnlinePeers()
Get list of online peers
```typescript
const peers = p2pService.getOnlinePeers();
```

### p2pService.isPeerOnline(email)
Check if specific peer is online
```typescript
const online = p2pService.isPeerOnline('user@example.com');
```

## Support

For issues or questions:
1. Check browser console for errors
2. Review server logs
3. Verify network connectivity
4. Test with smaller files first
5. Contact support with error messages

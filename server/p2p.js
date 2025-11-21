// P2P WebSocket Server for peer-to-peer email and file transfer
const WebSocket = require('ws');

class P2PServer {
  constructor() {
    this.peers = new Map(); // email -> { ws, userId, connected }
    this.messageQueue = new Map(); // email -> [messages]
  }

  /**
   * Initialize P2P WebSocket server
   */
  initialize(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/api/p2p'
    });

    this.wss.on('connection', (ws) => {
      console.log('New P2P connection');

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('P2P message error:', error);
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  /**
   * Handle incoming P2P messages
   */
  handleMessage(ws, message) {
    switch (message.type) {
      case 'register':
        this.handleRegister(ws, message);
        break;
      case 'email':
        this.handleEmailMessage(ws, message);
        break;
      case 'file-chunk':
        this.handleFileChunk(ws, message);
        break;
      case 'file-complete':
        this.handleFileComplete(ws, message);
        break;
    }
  }

  /**
   * Register peer on P2P network
   */
  handleRegister(ws, message) {
    const { userId, userEmail } = message;

    // Store peer connection
    this.peers.set(userEmail, {
      ws,
      userId,
      email: userEmail,
      connected: true,
      registeredAt: new Date()
    });

    console.log(`Peer registered: ${userEmail}`);

    // Notify all other peers that this peer is online
    this.broadcastToPeers({
      type: 'peer-online',
      userId,
      email: userEmail,
      timestamp: Date.now()
    }, userEmail);

    // Send queued messages if any
    if (this.messageQueue.has(userEmail)) {
      const messages = this.messageQueue.get(userEmail);
      messages.forEach(msg => {
        try {
          ws.send(JSON.stringify(msg));
        } catch (error) {
          console.error('Error sending queued message:', error);
        }
      });
      this.messageQueue.delete(userEmail);
    }

    // Send list of online peers
    const onlinePeers = Array.from(this.peers.values())
      .filter(p => p.email !== userEmail)
      .map(p => ({ email: p.email, userId: p.userId }));

    ws.send(JSON.stringify({
      type: 'peers-list',
      peers: onlinePeers,
      timestamp: Date.now()
    }));
  }

  /**
   * Handle email message routing
   */
  handleEmailMessage(ws, message) {
    const { from, to, data } = message;

    // Check if recipient is online
    const recipientPeer = this.peers.get(to);

    if (recipientPeer && recipientPeer.connected) {
      // Send directly to recipient
      try {
        recipientPeer.ws.send(JSON.stringify({
          type: 'email',
          from,
          data,
          timestamp: Date.now()
        }));

        // Acknowledge to sender
        ws.send(JSON.stringify({
          type: 'email-delivered',
          emailId: data.id,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error delivering email:', error);
        this.queueMessage(to, message);
      }
    } else {
      // Queue message for later delivery
      this.queueMessage(to, {
        type: 'email',
        from,
        data,
        timestamp: Date.now()
      });

      // Notify sender that recipient is offline
      ws.send(JSON.stringify({
        type: 'peer-offline',
        email: to,
        timestamp: Date.now()
      }));
    }
  }

  /**
   * Handle file chunk transfer
   */
  handleFileChunk(ws, message) {
    const { from, to, data } = message;

    // Check if recipient is online
    const recipientPeer = this.peers.get(to);

    if (recipientPeer && recipientPeer.connected) {
      try {
        recipientPeer.ws.send(JSON.stringify({
          type: 'file-chunk',
          from,
          data,
          timestamp: Date.now()
        }));

        // Send progress update to sender
        ws.send(JSON.stringify({
          type: 'chunk-received',
          emailId: data.emailId,
          chunkIndex: data.chunkIndex,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error transferring file chunk:', error);
      }
    }
  }

  /**
   * Handle file transfer completion
   */
  handleFileComplete(ws, message) {
    const { from, to, data } = message;

    const recipientPeer = this.peers.get(to);

    if (recipientPeer && recipientPeer.connected) {
      try {
        recipientPeer.ws.send(JSON.stringify({
          type: 'file-complete',
          from,
          data,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error sending file-complete:', error);
      }
    }
  }

  /**
   * Handle peer disconnect
   */
  handleDisconnect(ws) {
    // Find and remove peer
    for (const [email, peer] of this.peers.entries()) {
      if (peer.ws === ws) {
        peer.connected = false;
        console.log(`Peer disconnected: ${email}`);

        // Notify other peers
        this.broadcastToPeers({
          type: 'peer-offline',
          email,
          timestamp: Date.now()
        });

        break;
      }
    }
  }

  /**
   * Queue message for offline peer
   */
  queueMessage(email, message) {
    if (!this.messageQueue.has(email)) {
      this.messageQueue.set(email, []);
    }
    this.messageQueue.get(email).push(message);

    // Keep queue size reasonable (max 100 messages)
    const queue = this.messageQueue.get(email);
    if (queue.length > 100) {
      queue.shift();
    }
  }

  /**
   * Broadcast message to all peers except sender
   */
  broadcastToPeers(message, excludeEmail = null) {
    for (const [email, peer] of this.peers.entries()) {
      if (email !== excludeEmail && peer.connected) {
        try {
          peer.ws.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error broadcasting to ${email}:`, error);
        }
      }
    }
  }

  /**
   * Get online peers list
   */
  getOnlinePeers() {
    return Array.from(this.peers.values())
      .filter(p => p.connected)
      .map(p => ({
        email: p.email,
        userId: p.userId,
        registeredAt: p.registeredAt
      }));
  }

  /**
   * Get peer status
   */
  getPeerStatus(email) {
    const peer = this.peers.get(email);
    return peer ? {
      online: peer.connected,
      userId: peer.userId,
      registeredAt: peer.registeredAt
    } : null;
  }
}

module.exports = new P2PServer();

const WebSocket = require('ws');
const http = require('http');
const url = require('url');
const jwt = require('jsonwebtoken');
const FoodForTalkChatMessage = require('./models/FoodForTalkChatMessage');
const FoodForTalkUser = require('./models/FoodForTalkUser');

class FoodForTalkWebSocketServer {
  constructor(server) {
    console.log('🔧 Creating WebSocket server with path: /food-for-talk-chat');
    this.wss = new WebSocket.Server({ 
      server,
      path: '/food-for-talk-chat'
    });
    
    console.log('✅ WebSocket server created successfully');
    this.clients = new Map();
    this.startedConversations = new Set();
    this.setupWebSocketHandlers();
    console.log('🎯 WebSocket handlers setup complete');
  }

  setupWebSocketHandlers() {
    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection for Food for Talk chat');
      console.log('WebSocket connection from:', req.headers.origin || req.connection.remoteAddress);
      // Authenticate connection using token in query string (?token=...)
      try {
        const { query } = url.parse(req.url, true);
        const token = query.token;
        if (!token) {
          console.warn('WebSocket connection missing token; closing');
          ws.close();
          return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        if (decoded.type !== 'food-for-talk-secret') {
          console.warn('WebSocket token type invalid; closing');
          ws.close();
          return;
        }
        ws.authUser = { userId: decoded.userId, email: decoded.email, nickname: decoded.nickname };
      } catch (err) {
        console.error('WebSocket auth failed:', err?.message);
        try { ws.close(); } catch (_) {}
        return;
      }
      
      ws.on('message', (message) => {
        try {
          console.log('WebSocket: Received message:', message.toString());
          const data = JSON.parse(message);
          console.log('WebSocket: Parsed message data:', data);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        console.log('WebSocket: Connection closed');
        this.handleDisconnect(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  handleMessage(ws, data) {
    switch (data.type) {
      case 'join':
        this.handleJoin(ws, data);
        break;
      case 'send_message':
        this.handleSendMessage(ws, data);
        break;
      case 'send_private_message':
        this.handleSendPrivateMessage(ws, data);
        break;
      case 'leave':
        this.handleLeave(ws, data);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  async handleJoin(ws, data) {
    const auth = ws.authUser;
    if (!auth) {
      console.warn('handleJoin without auth; ignoring');
      return;
    }
    try {
      const user = await FoodForTalkUser.findByPk(auth.userId);
      const displayName = this.computeDisplayName(auth, user);
      const userInfo = { id: auth.userId, displayName };
      this.clients.set(ws, { userId: auth.userId, userInfo, joinedAt: new Date() });

      // Send welcome message to the joining user
      this.sendTo(ws, {
        type: 'message',
        message: {
          id: Date.now(),
          type: 'system',
          content: `Welcome ${displayName}! Be kind and have fun.`,
          timestamp: new Date().toISOString()
        }
      });

      // Send recent chat history (public messages)
      try {
        const recent = await FoodForTalkChatMessage.findAll({
          where: { message_type: 'public' },
          order: [['created_at', 'ASC']],
          limit: 50
        });
        const history = recent.map(m => ({
          id: m.id,
          userId: m.sender_id,
          displayName: 'display_name' in m ? m.display_name : undefined, // fallback if column exists
          content: m.content,
          timestamp: m.created_at,
          type: 'public'
        }));
        this.sendTo(ws, { type: 'chat_history', messages: history });
      } catch (e) {
        console.warn('Failed to load chat history:', e?.message);
      }

      // Notify all clients about new user (nickname only)
      this.broadcast({
        type: 'user_joined',
        user: { id: auth.userId, blurredName: displayName }
      }, ws);
    } catch (err) {
      console.error('handleJoin error:', err?.message);
    }
  }

  async handleSendMessage(ws, data) {
    console.log('WebSocket: handleSendMessage called with data:', data);
    const client = this.clients.get(ws);
    console.log('WebSocket: client found:', !!client);
    if (!client) {
      console.log('WebSocket: No client found, returning');
      return;
    }

    try {
      // Persist message
      const saved = await FoodForTalkChatMessage.create({
        sender_id: client.userId,
        recipient_id: null,
        content: (data.message && data.message.content) || data.content || '',
        message_type: 'public',
        conversation_id: null
      });

      const message = {
        id: saved.id,
        userId: client.userId,
        displayName: client.userInfo.displayName,
        content: saved.content,
        timestamp: saved.created_at,
        type: 'public'
      };

      // Broadcast to all connected clients
      this.broadcast({ type: 'message', message });
    } catch (err) {
      console.error('Failed to save/send public message:', err?.message);
    }
  }

  async handleSendPrivateMessage(ws, data) {
    const client = this.clients.get(ws);
    if (!client) return;

    const recipientId = (data.message && data.message.recipientId) || data.recipientId;
    const content = (data.message && data.message.content) || data.content || '';
    const conversationId = data.conversationId || (data.message && data.message.conversationId);

    try {
      const saved = await FoodForTalkChatMessage.create({
        sender_id: client.userId,
        recipient_id: recipientId,
        content,
        message_type: 'private',
        conversation_id: conversationId || [client.userId, recipientId].sort().join('-')
      });

      const message = {
        id: saved.id,
        senderId: client.userId,
        recipientId,
        senderDisplayName: client.userInfo.displayName,
        content: saved.content,
        timestamp: saved.created_at,
        type: 'private'
      };

      // Find recipient and sender
      const recipientWs = this.findClientByUserId(recipientId);
      const senderWs = this.findClientByUserId(client.userId);

      const payload = JSON.stringify({
        type: 'private_message',
        message,
        conversationId: saved.conversation_id
      });

      if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
        recipientWs.send(payload);
      }
      if (senderWs && senderWs.readyState === WebSocket.OPEN) {
        senderWs.send(payload);
      }

      // Announce the start of a private chat publicly (only once per conversation)
      const convKey = saved.conversation_id;
      if (!this.startedConversations.has(convKey)) {
        this.startedConversations.add(convKey);
        const recipientClientWs = this.findClientByUserId(recipientId);
        const recipientClient = recipientClientWs ? this.clients.get(recipientClientWs) : null;
        const recipientName = recipientClient?.userInfo?.displayName || 'Someone';
        this.broadcast({
          type: 'message',
          message: {
            id: Date.now(),
            type: 'system',
            content: `${client.userInfo.displayName} and ${recipientName} started a private chat`,
            timestamp: new Date().toISOString()
          }
        });
      }
    } catch (err) {
      console.error('Failed to save/send private message:', err?.message);
    }
  }

  handleLeave(ws, data) {
    const client = this.clients.get(ws);
    if (client) {
      this.broadcast({
        type: 'user_left',
        userId: client.userId
      }, ws);
    }
    this.clients.delete(ws);
  }

  handleDisconnect(ws) {
    const client = this.clients.get(ws);
    if (client) {
      this.broadcast({
        type: 'user_left',
        userId: client.userId
      }, ws);
    }
    this.clients.delete(ws);
  }

  findClientByUserId(userId) {
    for (const [ws, client] of this.clients) {
      if (client.userId === userId) {
        return ws;
      }
    }
    return null;
  }

  broadcast(data, excludeWs = null) {
    const message = JSON.stringify(data);
    console.log('WebSocket: Broadcasting to clients:', message);
    let sentCount = 0;
    this.clients.forEach((client, ws) => {
      if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
        console.log('WebSocket: Sending to client:', client.userId);
        ws.send(message);
        sentCount++;
      } else {
        console.log('WebSocket: Skipping client (excluded or not open):', client.userId, 'readyState:', ws.readyState);
      }
    });
    console.log('WebSocket: Message sent to', sentCount, 'clients');
  }

  sendTo(ws, data) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  computeDisplayName(auth, user) {
    if (auth?.nickname && auth.nickname.trim().length > 0) return auth.nickname.trim();
    const first = user?.first_name || 'User';
    return `${first.charAt(0)}***`;
  }

  getConnectedUsers() {
    return Array.from(this.clients.values()).map(client => ({
      userId: client.userId,
      userInfo: client.userInfo,
      joinedAt: client.joinedAt
    }));
  }
}

module.exports = FoodForTalkWebSocketServer;

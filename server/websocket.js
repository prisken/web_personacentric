const WebSocket = require('ws');
const http = require('http');

class FoodForTalkWebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/food-for-talk-chat'
    });
    
    this.clients = new Map();
    this.setupWebSocketHandlers();
  }

  setupWebSocketHandlers() {
    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection for Food for Talk chat');
      console.log('WebSocket connection from:', req.headers.origin || req.connection.remoteAddress);
      
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

  handleJoin(ws, data) {
    const { userId, userInfo } = data;
    this.clients.set(ws, { userId, userInfo, joinedAt: new Date() });
    
    // Notify all clients about new user
    this.broadcast({
      type: 'user_joined',
      user: { ...userInfo, blurredName: `${userInfo.firstName.charAt(0)}***` }
    }, ws);
  }

  handleSendMessage(ws, data) {
    console.log('WebSocket: handleSendMessage called with data:', data);
    const client = this.clients.get(ws);
    console.log('WebSocket: client found:', !!client);
    if (!client) {
      console.log('WebSocket: No client found, returning');
      return;
    }

    const message = {
      ...data.message,
      timestamp: new Date().toISOString()
    };

    console.log('WebSocket: Broadcasting message:', message);
    console.log('WebSocket: Number of connected clients:', this.clients.size);

    // Broadcast to all connected clients
    this.broadcast({
      type: 'message',
      message
    });
  }

  handleSendPrivateMessage(ws, data) {
    const client = this.clients.get(ws);
    if (!client) return;

    const message = {
      ...data.message,
      timestamp: new Date().toISOString()
    };

    // Find recipient and sender
    const recipientWs = this.findClientByUserId(data.message.recipientId);
    const senderWs = this.findClientByUserId(data.message.senderId);

    if (recipientWs) {
      recipientWs.send(JSON.stringify({
        type: 'private_message',
        message,
        conversationId: data.conversationId
      }));
    }

    if (senderWs && senderWs !== recipientWs) {
      senderWs.send(JSON.stringify({
        type: 'private_message',
        message,
        conversationId: data.conversationId
      }));
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

  getConnectedUsers() {
    return Array.from(this.clients.values()).map(client => ({
      userId: client.userId,
      userInfo: client.userInfo,
      joinedAt: client.joinedAt
    }));
  }
}

module.exports = FoodForTalkWebSocketServer;

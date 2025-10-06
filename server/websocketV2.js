const WebSocket = require('ws');
const url = require('url');
const jwt = require('jsonwebtoken');
const FoodForTalkUser = require('./models/FoodForTalkUser');
const FoodForTalkChatMessage = require('./models/FoodForTalkChatMessage');

class FoodForTalkWebSocketServerV2 {
  constructor(server) {
    this.wss = new WebSocket.Server({ server, path: '/food-for-talk-chat-v2' });
    this.userIdToSocket = new Map();
    this.socketToClient = new Map();
    this.startedConversations = new Set();
    this.wss.on('connection', (ws, req) => this.onConnection(ws, req));
  }

  async onConnection(ws, req) {
    // Auth
    let authUser;
    try {
      const { query } = url.parse(req.url, true);
      const token = query.token;
      if (!token) return ws.close();
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      if (decoded.type !== 'food-for-talk-secret') return ws.close();
      authUser = decoded; // { userId, email, nickname }
    } catch (e) {
      try { ws.close(); } catch (_) {}
      return;
    }

    // Resolve display name
    const displayName = await this.getDisplayName(authUser);
    const clientMeta = { userId: authUser.userId, displayName, connectedAt: new Date() };
    this.userIdToSocket.set(authUser.userId, ws);
    this.socketToClient.set(ws, clientMeta);

    // Welcome + history
    this.send(ws, { type: 'welcome', message: `Welcome ${displayName}!` });
    const history = await this.fetchRecentPublicHistory(50);
    this.send(ws, { type: 'history', messages: history });

    // Send session info to client
    this.send(ws, { type: 'session', user: { id: authUser.userId, displayName } });

    // Send current online participants list to the joining client
    try {
      const participants = this.getOnlineParticipants();
      this.send(ws, { type: 'presence_list', participants });
    } catch (_) {}

    // Presence announce
    this.broadcast({ type: 'presence_joined', user: { id: authUser.userId, displayName } }, ws);

    ws.on('message', (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        this.onMessage(ws, data);
      } catch (err) {
        // ignore
      }
    });
    ws.on('close', () => this.onClose(ws));
    ws.on('error', () => this.onClose(ws));
  }

  async onMessage(ws, data) {
    const client = this.socketToClient.get(ws);
    if (!client) return;

    switch (data.type) {
      case 'public_message':
        await this.handlePublicMessage(client, data);
        break;
      case 'private_message':
        await this.handlePrivateMessage(client, data);
        break;
      default:
        break;
    }
  }

  async handlePublicMessage(client, data) {
    const content = (data.content || '').trim();
    if (!content) return;
    const saved = await FoodForTalkChatMessage.create({
      sender_id: client.userId,
      recipient_id: null,
      content,
      message_type: 'public',
      conversation_id: null
    });
    const message = {
      id: saved.id,
      userId: client.userId,
      displayName: client.displayName,
      content: saved.content,
      timestamp: saved.created_at,
      type: 'public'
    };
    this.broadcast({ type: 'public_message', message });
  }

  async handlePrivateMessage(client, data) {
    const recipientId = data.recipientId;
    const content = (data.content || '').trim();
    if (!recipientId || !content) return;
    const conversationId = [client.userId, recipientId].sort().join('-');
    const saved = await FoodForTalkChatMessage.create({
      sender_id: client.userId,
      recipient_id: recipientId,
      content,
      message_type: 'private',
      conversation_id: conversationId
    });
    const message = {
      id: saved.id,
      senderId: client.userId,
      recipientId,
      senderDisplayName: client.displayName,
      content: saved.content,
      timestamp: saved.created_at,
      type: 'private'
    };
    // Deliver to both parties
    const recipientWs = this.userIdToSocket.get(recipientId);
    const senderWs = this.userIdToSocket.get(client.userId);
    const payload = { type: 'private_message', message, conversationId };
    if (recipientWs) this.send(recipientWs, payload);
    if (senderWs) this.send(senderWs, payload);

    // Public one-time announcement
    if (!this.startedConversations.has(conversationId)) {
      this.startedConversations.add(conversationId);
      const recipientName = await this.getDisplayNameByUserId(recipientId);
      this.broadcast({
        type: 'system',
        message: {
          id: Date.now(),
          type: 'system',
          content: `${client.displayName} and ${recipientName} started a private chat`,
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  onClose(ws) {
    const client = this.socketToClient.get(ws);
    if (!client) return;
    this.socketToClient.delete(ws);
    this.userIdToSocket.delete(client.userId);
    this.broadcast({ type: 'presence_left', userId: client.userId });
  }

  async fetchRecentPublicHistory(limit = 50) {
    const rows = await FoodForTalkChatMessage.findAll({
      where: { message_type: 'public' },
      order: [['created_at', 'ASC']],
      limit
    });
    const messages = [];
    for (const m of rows) {
      const displayName = await this.getDisplayNameByUserId(m.sender_id);
      messages.push({
        id: m.id,
        userId: m.sender_id,
        displayName,
        content: m.content,
        timestamp: m.created_at,
        type: 'public'
      });
    }
    return messages;
  }

  async getDisplayName(authUser) {
    if (authUser?.nickname && authUser.nickname.trim().length > 0) return authUser.nickname.trim();
    return this.getDisplayNameByUserId(authUser.userId);
  }

  async getDisplayNameByUserId(userId) {
    try {
      const user = await FoodForTalkUser.findByPk(userId);
      if (!user) return 'User***';
      if (user.nickname && user.nickname.trim().length > 0) return user.nickname.trim();
      const first = user.first_name || 'User';
      return `${first.charAt(0)}***`;
    } catch (_) {
      return 'User***';
    }
  }

  broadcast(data, excludeWs = null) {
    const msg = JSON.stringify(data);
    this.socketToClient.forEach((meta, ws) => {
      if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) ws.send(msg);
    });
  }

  send(ws, data) {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
  }

  getOnlineParticipants() {
    const list = [];
    this.socketToClient.forEach((meta) => {
      list.push({ id: meta.userId, displayName: meta.displayName });
    });
    return list;
  }
}

module.exports = FoodForTalkWebSocketServerV2;



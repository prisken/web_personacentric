import React, { useEffect, useRef, useState } from 'react';

const ChatV2Interface = ({ token }) => {
  const [messages, setMessages] = useState([]); // public + system
  const [participants, setParticipants] = useState([]);
  const [activeTab, setActiveTab] = useState('public');
  const [privateConversations, setPrivateConversations] = useState({}); // id -> msgs
  const [openDMs, setOpenDMs] = useState([]); // [{id, userId, name}]
  const [currentUserId, setCurrentUserId] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const wsBase = process.env.REACT_APP_WS_URL || (process.env.NODE_ENV === 'production' ? 'wss://webpersonacentric-personacentric.up.railway.app' : 'ws://localhost:5001');
    const ws = new WebSocket(`${wsBase}/food-for-talk-chat-v2?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onopen = () => {};
    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      switch (data.type) {
        case 'session':
          setCurrentUserId(data.user?.id || null);
          break;
        case 'welcome':
          setMessages(prev => [...prev, { id: Date.now(), type: 'system', content: data.message, timestamp: new Date().toISOString() }]);
          break;
        case 'history':
          setMessages(prev => {
            const ids = new Set(prev.map(m => m.id));
            const merged = [...prev];
            (data.messages || []).forEach(m => { if (!ids.has(m.id)) merged.push(m); });
            return merged;
          });
          break;
        case 'public_message':
          setMessages(prev => prev.some(m => m.id === data.message.id) ? prev : [...prev, data.message]);
          break;
        case 'private_message':
          setPrivateConversations(prev => {
            const list = prev[data.conversationId] || [];
            if (list.some(m => m.id === data.message.id)) return prev;
            return { ...prev, [data.conversationId]: [...list, data.message] };
          });
          // Ensure DM tab exists for recipient or sender view
          setOpenDMs(prev => {
            const peerId = data.message.senderId === currentUserId ? data.message.recipientId : data.message.senderId;
            const convId = data.conversationId;
            if (prev.find(d => d.id === convId)) return prev;
            const peer = participants.find(p => p.id === peerId);
            return [...prev, { id: convId, userId: peerId, name: peer?.name || data.message.senderDisplayName || 'DM' }];
          });
          break;
        case 'system':
          setMessages(prev => [...prev, data.message]);
          break;
        case 'presence_joined':
          setParticipants(prev => prev.find(p => p.id === data.user.id) ? prev : [...prev, { id: data.user.id, name: data.user.displayName }]);
          break;
        case 'presence_left':
          setParticipants(prev => prev.filter(p => p.id !== data.userId));
          break;
        default:
          break;
      }
    };
    ws.onclose = () => { wsRef.current = null; };
    ws.onerror = () => {};
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, [token]);

  const sendPublic = (content) => {
    if (!content.trim() || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: 'public_message', content: content.trim() }));
  };

  const sendPrivate = (userId, content) => {
    if (!content.trim() || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: 'private_message', recipientId: userId, content: content.trim() }));
    const conversationId = [userId, currentUserId || 'me'].sort().join('-');
    if (!openDMs.find(d => d.id === conversationId)) {
      const participant = participants.find(p => p.id === userId);
      setOpenDMs(prev => [...prev, { id: conversationId, userId, name: participant?.name || 'DM' }]);
    }
    setActiveTab(conversationId);
  };

  const renderMessages = () => {
    if (activeTab === 'public') {
      return messages.map(m => (
        <div key={m.id} className="px-3 py-1">
          {m.type === 'system' ? (
            <div className="text-yellow-300 text-xs text-center">{m.content}</div>
          ) : (
            <div className="text-white"><span className="text-white/70 mr-2">{m.displayName}</span>{m.content}</div>
          )}
        </div>
      ));
    }
    const conv = privateConversations[activeTab] || [];
    return conv.map(m => (
      <div key={m.id} className="px-3 py-1 text-white">
        <span className="text-white/70 mr-2">{m.senderDisplayName}</span>{m.content}
      </div>
    ));
  };

  const InputBar = ({ onSend, placeholder }) => {
    const [text, setText] = useState('');
    return (
      <div className="p-3 bg-white/10 border-t border-white/20 flex">
        <input className="flex-1 bg-white/20 rounded px-3 py-2 text-white outline-none" value={text} placeholder={placeholder} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { onSend(text); setText(''); } }} />
        <button className="ml-2 px-4 rounded bg-blue-500 text-white" onClick={() => { onSend(text); setText(''); }}>Send</button>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="bg-white/10 border-b border-white/20 px-4 py-3 text-white flex items-center justify-between">
        <div className="font-semibold">🌐 Public Chat</div>
        <div className="text-white/70 text-sm">{participants.length} online</div>
      </div>

      <div className="bg-black/20 border-b border-white/10 flex overflow-x-auto">
        <button className={`px-4 py-2 text-sm ${activeTab==='public'?'text-yellow-400 border-b-2 border-yellow-400':'text-white/70'}`} onClick={() => setActiveTab('public')}>Public</button>
        {openDMs.map(dm => (
          <button key={dm.id} className={`px-4 py-2 text-sm ${activeTab===dm.id?'text-blue-400 border-b-2 border-blue-400':'text-white/70'}`} onClick={() => setActiveTab(dm.id)}>💬 {dm.name}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2 pb-24">
        {renderMessages()}
      </div>

      <div className="fixed left-0 right-0 bottom-0">
        {activeTab === 'public' ? (
          <InputBar onSend={sendPublic} placeholder="Say something fun..." />
        ) : (
          <InputBar onSend={(text) => {
            const dm = openDMs.find(d => d.id === activeTab);
            if (dm) sendPrivate(dm.userId, text);
          }} placeholder="Send a private message..." />
        )}
      </div>

      {/* Mobile participants drawer trigger */}
      <div className="fixed right-4 bottom-24">
        <details className="group">
          <summary className="cursor-pointer px-3 py-2 rounded bg-white/20 text-white">Participants</summary>
          <div className="absolute right-0 mt-2 w-72 bg-white/10 backdrop-blur border border-white/20 rounded p-2 max-h-96 overflow-auto">
            {participants.map(p => (
              <div key={p.id} className="flex items-center justify-between text-white px-2 py-2 hover:bg-white/10 rounded">
                <div>{p.name}</div>
                <button className="text-blue-300" onClick={() => {
                  const convId = [p.id, currentUserId || 'me'].sort().join('-');
                  if (!openDMs.find(d => d.id === convId)) setOpenDMs(prev => [...prev, { id: convId, userId: p.id, name: p.name }]);
                  setActiveTab(convId);
                }}>Chat</button>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default ChatV2Interface;



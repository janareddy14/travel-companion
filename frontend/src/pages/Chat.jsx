import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function Chat() {
  const { socket, onlineUsers } = useSocket();
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (activeRoomId) {
      fetchMessages(activeRoomId);
      if (socket) {
        socket.emit('join_room', activeRoomId);
      }
    }
  }, [activeRoomId, socket]);

  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (message) => {
      if (message.chatRoomId === activeRoomId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
      fetchRooms(); // Update last message in room list
    };

    const onUserTyping = ({ userId, roomId }) => {
      if (roomId === activeRoomId && userId !== user?.userId) {
        setTypingUsers(prev => new Set(prev).add(userId));
      }
    };

    const onUserStopTyping = ({ userId, roomId }) => {
      if (roomId === activeRoomId) {
        setTypingUsers(prev => {
          const s = new Set(prev);
          s.delete(userId);
          return s;
        });
      }
    };

    socket.on('new_message', onNewMessage);
    socket.on('user_typing', onUserTyping);
    socket.on('user_stop_typing', onUserStopTyping);

    return () => {
      socket.off('new_message', onNewMessage);
      socket.off('user_typing', onUserTyping);
      socket.off('user_stop_typing', onUserStopTyping);
    };
  }, [socket, activeRoomId, user?.userId]);

  const fetchRooms = async () => {
    try {
      const data = await api.get('/chat/rooms');
      setRooms(data);
    } catch (err) {
      console.error('Failed to load rooms', err);
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      const data = await api.get(`/chat/rooms/${roomId}/messages`);
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoomId || !socket) return;

    socket.emit('send_message', {
      roomId: activeRoomId,
      content: newMessage,
    });
    
    socket.emit('stop_typing', activeRoomId);
    setNewMessage('');
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (socket && activeRoomId) {
      if (e.target.value) {
        socket.emit('typing', activeRoomId);
      } else {
        socket.emit('stop_typing', activeRoomId);
      }
    }
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);
  const otherParticipant = activeRoom?.participants.find(p => p.id !== user?.userId);

  return (
    <section className="dashboard-page">
      <div className="container" style={{ display: 'flex', height: 'calc(100vh - 200px)', gap: '20px' }}>
        
        {/* Rooms List */}
        <div className="panel" style={{ width: '300px', display: 'flex', flexDirection: 'column', padding: '0' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0 }}>Conversations</h3>
          </div>
          
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {rooms.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gray)' }}>
                No conversations yet. Match with travel companions to start chatting!
              </div>
            ) : (
              rooms.map(room => {
                const other = room.participants.find(p => p.id !== user?.userId);
                const isOnline = onlineUsers.has(other?.id) || other?.isOnline;
                
                return (
                  <div 
                    key={room.id}
                    onClick={() => setActiveRoomId(room.id)}
                    style={{
                      padding: '15px 20px',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border)',
                      background: activeRoomId === room.id ? 'var(--bg-secondary)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {other?.username.charAt(0).toUpperCase()}
                      </div>
                      {isOnline && (
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', border: '2px solid white' }}></div>
                      )}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{other?.username}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {room.lastMessage || 'No messages yet'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0' }}>
          {activeRoomId ? (
            <>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {otherParticipant?.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{otherParticipant?.username}</h3>
                  <div style={{ fontSize: '0.85rem', color: (onlineUsers.has(otherParticipant?.id) || otherParticipant?.isOnline) ? '#10b981' : 'var(--gray)' }}>
                    {(onlineUsers.has(otherParticipant?.id) || otherParticipant?.isOnline) ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-secondary)' }}>
                {messages.map(msg => {
                  const isMine = msg.senderId === user?.userId;
                  return (
                    <div key={msg.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                      <div style={{
                        padding: '10px 15px',
                        borderRadius: isMine ? '15px 15px 0 15px' : '15px 15px 15px 0',
                        background: isMine ? 'var(--primary)' : 'var(--bg-main)',
                        color: isMine ? 'white' : 'inherit',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}>
                        {msg.content}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '4px', textAlign: isMine ? 'right' : 'left' }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
                {typingUsers.size > 0 && (
                  <div style={{ alignSelf: 'flex-start', fontSize: '0.85rem', color: 'var(--gray)', fontStyle: 'italic' }}>
                    typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleTyping}
                    style={{ flex: 1, margin: 0 }}
                  />
                  <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray)', flexDirection: 'column', gap: '10px' }}>
              <i className="far fa-comments" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

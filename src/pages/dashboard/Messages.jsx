
import { useState } from 'react';
import { FaPaperPlane, FaPhone, FaVideo, FaSearch, FaCircle } from 'react-icons/fa';

const Messages = () => {
    const [activeChat, setActiveChat] = useState(0);
    const [messageInput, setMessageInput] = useState('');

    // Mock Data
    const conversations = [
        { id: 0, name: 'DeFi Protocol X', lastMsg: 'When can you start?', time: '2m', unread: 1, online: true },
        { id: 1, name: 'Solana Foundation', lastMsg: 'Thanks for applying!', time: '1h', unread: 0, online: false },
        { id: 2, name: 'Alice Dev', lastMsg: 'Check out the repo.', time: '1d', unread: 0, online: true },
    ];

    const messages = [
        { id: 1, sender: 'them', text: 'Hi! We reviewed your profile and loved your Rust experience.', time: '10:30 AM' },
        { id: 2, sender: 'me', text: 'Thanks! I appreciate that. I have been working with Rust for 3 years now.', time: '10:32 AM' },
        { id: 3, sender: 'them', text: 'Great. We are looking for someone to lead our matching engine optimizations.', time: '10:33 AM' },
        { id: 4, sender: 'them', text: 'When can you start?', time: '10:33 AM' },
    ];

    const handleSend = (e) => {
        e.preventDefault();
        alert(`Sending message: ${messageInput} (Supabase Realtime integration coming soon)`);
        setMessageInput('');
    };

    const handleCall = (type) => {
        alert(`Starting ${type} call... (WebRTC implementation coming soon)`);
    };

    return (
        <div className="messages-page">
            <div className="chat-layout">
                {/* Sidebar List */}
                <div className="chat-sidebar">
                    <div className="chat-header">
                        <h2>Messages</h2>
                        <div className="search-bar">
                            <FaSearch />
                            <input type="text" placeholder="Search..." />
                        </div>
                    </div>
                    <div className="conversation-list">
                        {conversations.map((chat) => (
                            <div
                                key={chat.id}
                                className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
                                onClick={() => setActiveChat(chat.id)}
                            >
                                <div className="avatar">
                                    {chat.name.charAt(0)}
                                    {chat.online && <span className="online-dot"></span>}
                                </div>
                                <div className="chat-info">
                                    <div className="chat-top">
                                        <span className="name">{chat.name}</span>
                                        <span className="time">{chat.time}</span>
                                    </div>
                                    <div className="chat-bottom">
                                        <span className="preview">{chat.lastMsg}</span>
                                        {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="chat-window">
                    <div className="window-header">
                        <div className="header-user">
                            <div className="avatar small">{conversations[activeChat].name.charAt(0)}</div>
                            <div className="user-details">
                                <span className="name">{conversations[activeChat].name}</span>
                                <span className="status">{conversations[activeChat].online ? 'Online' : 'Offline'}</span>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button onClick={() => handleCall('voice')}><FaPhone /></button>
                            <button onClick={() => handleCall('video')}><FaVideo /></button>
                        </div>
                    </div>

                    <div className="messages-list">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message-bubble ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                                <div className="message-content">
                                    <p>{msg.text}</p>
                                    <span className="msg-time">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form className="message-input-area" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <button type="submit" className="send-btn">
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                .messages-page {
                    height: calc(100vh - 100px); /* Adjust based on topbar */
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .chat-layout {
                    display: flex;
                    height: 100%;
                }
                
                /* Sidebar */
                .chat-sidebar {
                    width: 300px;
                    border-right: 1px solid #222;
                    background: #0a0a0a;
                    display: flex;
                    flex-direction: column;
                }
                .chat-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #222;
                }
                .chat-header h2 { font-size: 1.4rem; margin-bottom: 1rem; }
                .search-bar {
                    background: #161616;
                    border-radius: 6px;
                    padding: 0.6rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #666;
                }
                .search-bar input {
                    background: none;
                    border: none;
                    color: #fff;
                    width: 100%;
                }
                .search-bar input:focus { outline: none; }

                .conversation-list {
                    flex: 1;
                    overflow-y: auto;
                }
                .chat-item {
                    padding: 1rem 1.5rem;
                    display: flex;
                    gap: 1rem;
                    cursor: pointer;
                    transition: background 0.2s;
                    border-bottom: 1px solid #161616;
                }
                .chat-item:hover, .chat-item.active { background: #1a1a1a; }
                .chat-item.active { border-right: 2px solid var(--primary-orange); }

                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #222;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    color: var(--primary-orange);
                    position: relative;
                }
                .avatar.small { width: 36px; height: 36px; font-size: 0.9rem; }
                .online-dot {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 10px;
                    height: 10px;
                    background: #4cd137;
                    border-radius: 50%;
                    border: 2px solid #0a0a0a;
                }

                .chat-info { flex: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
                .chat-top { display: flex; justify-content: space-between; margin-bottom: 4px; }
                .name { font-weight: 600; font-size: 0.95rem; }
                .time { font-size: 0.8rem; color: #666; }
                .chat-bottom { display: flex; justify-content: space-between; align-items: center; }
                .preview { font-size: 0.85rem; color: #888; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 120px; }
                .unread-badge { background: var(--primary-orange); color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; }

                /* Chat Window */
                .chat-window {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: #0e0e0e;
                }
                .window-header {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #222;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #111;
                }
                .header-user { display: flex; align-items: center; gap: 1rem; }
                .user-details { display: flex; flex-direction: column; }
                .status { font-size: 0.8rem; color: #4cd137; }
                
                .header-actions { display: flex; gap: 1rem; }
                .header-actions button {
                    background: #222;
                    border: none;
                    color: #aaa;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .header-actions button:hover { background: #333; color: white; }

                .messages-list {
                    flex: 1;
                    padding: 1.5rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .message-bubble {
                    display: flex;
                    max-width: 60%;
                }
                .message-bubble.sent { align-self: flex-end; justify-content: flex-end; }
                .message-bubble.received { align-self: flex-start; }
                
                .message-content {
                    padding: 1rem;
                    border-radius: 12px;
                    background: #222;
                    position: relative;
                }
                .sent .message-content { background: var(--primary-orange); color: white; }
                .sent .msg-time { color: rgba(255,255,255,0.7); }
                .msg-time {
                    display: block;
                    font-size: 0.7rem;
                    color: #666;
                    margin-top: 5px;
                    text-align: right;
                }

                .message-input-area {
                    padding: 1.5rem;
                    border-top: 1px solid #222;
                    display: flex;
                    gap: 1rem;
                    background: #111;
                }
                .message-input-area input {
                    flex: 1;
                    padding: 1rem;
                    border-radius: 8px;
                    border: 1px solid #333;
                    background: #0a0a0a;
                    color: white;
                }
                .message-input-area input:focus { outline: none; border-color: var(--primary-orange); }
                .send-btn {
                    background: var(--primary-orange);
                    border: none;
                    color: white;
                    width: 50px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1.1rem;
                }
                
                @media (max-width: 768px) {
                    .chat-sidebar { width: 80px; }
                    .chat-info, .chat-header h2, .search-bar { display: none; }
                    .chat-header { padding: 1rem; }
                    .avatar { margin: 0 auto; }
                }
            `}</style>
        </div>
    );
};

export default Messages;

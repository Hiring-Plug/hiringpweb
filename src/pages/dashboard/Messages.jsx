
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { FaPaperPlane, FaSearch, FaUser, FaCircle } from 'react-icons/fa';
import { sendEmailNotification, EMAIL_TEMPLATES } from '../../services/email';

const Messages = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // 1. Fetch Conversations on Mount
    useEffect(() => {
        if (user) {
            fetchConversations();

            // Subscribe to new conversations/updates
            const subscription = supabase
                .channel('public:conversations')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload) => {
                    // In a real app, strict checking if user is participant
                    fetchConversations(); // refresh list
                })
                .subscribe();

            return () => { supabase.removeChannel(subscription); };
        }
    }, [user]);

    // 2. Fetch Messages when Active Chat changes
    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat.id);

            // Subscribe to new messages for this chat
            const subscription = supabase
                .channel(`chat:${activeChat.id}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${activeChat.id}`
                }, (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                    scrollToBottom();
                })
                .subscribe();

            return () => { supabase.removeChannel(subscription); };
        }
    }, [activeChat]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            // Get conversations where user is p1 or p2
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    *,
                    p1:participant1_id(username, avatar_url),
                    p2:participant2_id(username, avatar_url)
                `)
                .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
                .order('updated_at', { ascending: false });

            if (error) throw error;

            // Format data to identify "other user"
            const formatted = data.map(conv => {
                const other = conv.participant1_id === user.id ? conv.p2 : conv.p1;
                return { ...conv, otherUser: other };
            });
            setConversations(formatted);
        } catch (error) {
            console.error('Error loading chats:', error);
            // setConversations(mockConversations); // For demo visual if needed
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (convId) => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true });

        setMessages(data || []);
        setTimeout(scrollToBottom, 100);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const text = newMessage;
        setNewMessage(''); // optimistic clear

        const otherUserId = activeChat.participant1_id === user.id ? activeChat.participant2_id : activeChat.participant1_id;

        try {
            // 1. Insert Message
            const { error } = await supabase.from('messages').insert([{
                conversation_id: activeChat.id,
                sender_id: user.id,
                receiver_id: otherUserId,
                content: text
            }]);

            if (error) throw error;

            // 2. Update Conversation (last_message, updated_at) to bump it up
            await supabase.from('conversations')
                .update({ last_message: text, updated_at: new Date() })
                .eq('id', activeChat.id);

            // 3. Trigger Notification for Receiver
            await supabase.from('notifications').insert([{
                user_id: otherUserId,
                type: 'message',
                content: `New message from ${user.user_metadata?.username || 'User'}`,
                link: '/app/messages',
                is_read: false
            }]);

            // 4. Send Email Notification (Async, don't await)
            const template = EMAIL_TEMPLATES.NEW_MESSAGE(user.user_metadata?.username || 'Someone', text);
            sendEmailNotification({
                recipientUserId: otherUserId,
                ...template
            });

        } catch (error) {
            console.error('Send error:', error);
            alert('Failed to send');
        }
    };

    return (
        <div className="messages-layout">
            {/* Left: Chat List */}
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <h2>Messages</h2>
                    <div className="search-bar">
                        <FaSearch />
                        <input placeholder="Search..." />
                    </div>
                </div>
                <div className="convo-list">
                    {loading ? <p className="p-4 text-center">Loading...</p> : conversations.length === 0 ? <p className="p-4 text-center text-gray-500">No messages yet.</p> : (
                        conversations.map(chat => (
                            <div
                                key={chat.id}
                                className={`convo-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                                onClick={() => setActiveChat(chat)}
                            >
                                <div className="user-avatar">
                                    <FaUser />
                                </div>
                                <div className="convo-info">
                                    <div className="top-row">
                                        <h4>{chat.otherUser?.username || 'Unknown'}</h4>
                                        <span className="time">
                                            {new Date(chat.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="preview">{chat.last_message || 'Start chatting...'}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right: Active Chat */}
            <div className="chat-main">
                {activeChat ? (
                    <>
                        <div className="chat-header">
                            <div className="header-user">
                                <div className="user-avatar sm">
                                    <FaUser />
                                </div>
                                <h3>{activeChat.otherUser?.username}</h3>
                            </div>
                            <div className="online-status">
                                <FaCircle className="status-dot" /> Online
                            </div>
                        </div>

                        <div className="messages-area">
                            {messages.map((msg, i) => (
                                <div key={i} className={`message-bubble ${msg.sender_id === user.id ? 'sent' : 'received'}`}>
                                    <p>{msg.content}</p>
                                    <span className="msg-time">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={handleSendMessage}>
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                            />
                            <button type="submit" disabled={!newMessage.trim()}>
                                <FaPaperPlane />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <FaPaperPlane className="big-icon" />
                        <h3>Select a conversation</h3>
                        <p>Choose a thread from the left to start chatting.</p>
                    </div>
                )}
            </div>

            <style>{`
                .messages-layout {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    height: calc(100vh - 100px); /* Adjust for header/padding */
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    overflow: hidden;
                }

                /* Sidebar */
                .chat-sidebar {
                    border-right: 1px solid #222;
                    display: flex;
                    flex-direction: column;
                    background: #0f0f0f;
                }
                .sidebar-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #222;
                }
                .sidebar-header h2 { margin: 0 0 1rem 0; font-size: 1.5rem; }
                .search-bar {
                    background: #222;
                    display: flex;
                    align-items: center;
                    padding: 0 1rem;
                    border-radius: 8px;
                    gap: 10px;
                    color: #666;
                }
                .search-bar input {
                    background: transparent;
                    border: none;
                    color: white;
                    padding: 10px 0;
                    width: 100%;
                    outline: none;
                }

                .convo-list {
                    flex: 1;
                    overflow-y: auto;
                }
                .convo-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 1.2rem;
                    cursor: pointer;
                    transition: background 0.2s;
                    border-bottom: 1px solid #1a1a1a;
                }
                .convo-item:hover, .convo-item.active {
                    background: #1a1a1a;
                }
                .convo-item.active {
                    border-left: 3px solid var(--primary-orange);
                    background: rgba(237, 80, 0, 0.05);
                }

                .user-avatar {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: #333;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                }
                .convo-info { flex: 1; min-width: 0; }
                .top-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
                .top-row h4 { margin: 0; font-size: 1rem; color: #fff; }
                .time { font-size: 0.75rem; color: #666; }
                .preview { margin: 0; font-size: 0.9rem; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                /* Main Chat */
                .chat-main {
                    display: flex;
                    flex-direction: column;
                    background: #111;
                }
                .chat-header {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #222;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .header-user { display: flex; align-items: center; gap: 10px; }
                .user-avatar.sm { width: 32px; height: 32px; font-size: 0.8rem; }
                .chat-header h3 { margin: 0; font-size: 1.1rem; }
                .online-status { font-size: 0.85rem; color: #4cd137; display: flex; align-items: center; gap: 6px; }
                .status-dot { font-size: 0.5rem; }

                .messages-area {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .message-bubble {
                    max-width: 70%;
                    padding: 0.8rem 1.2rem;
                    border-radius: 12px;
                    position: relative;
                }
                .message-bubble.received {
                    align-self: flex-start;
                    background: #222;
                    border-bottom-left-radius: 2px;
                }
                .message-bubble.sent {
                    align-self: flex-end;
                    background: var(--primary-orange);
                    color: white;
                    border-bottom-right-radius: 2px;
                }
                .msg-time {
                    display: block;
                    font-size: 0.7rem;
                    margin-top: 4px;
                    opacity: 0.7;
                    text-align: right;
                }

                .chat-input-area {
                    padding: 1rem 1.5rem;
                    border-top: 1px solid #222;
                    display: flex;
                    gap: 1rem;
                }
                .chat-input-area input {
                    flex: 1;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    padding: 12px;
                    border-radius: 25px;
                    color: white;
                    outline: none;
                }
                .chat-input-area input:focus { border-color: var(--primary-orange); }
                .chat-input-area button {
                    background: var(--primary-orange);
                    border: none;
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .chat-input-area button:disabled { opacity: 0.5; cursor: default; }
                .chat-input-area button:hover:not(:disabled) { transform: scale(1.05); }

                .no-chat-selected {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #444;
                }
                .big-icon { font-size: 4rem; opacity: 0.2; margin-bottom: 1rem; }

                @media (max-width: 768px) {
                    .messages-layout { grid-template-columns: 80px 1fr; }
                    .search-bar, .convo-info, .sidebar-header h2 { display: none; }
                    .chat-sidebar { align-items: center; }
                    .convo-item { justify-content: center; padding: 1rem 0; }
                    .convo-item.active { border-left: none; border-right: 3px solid var(--primary-orange); }
                }
            `}</style>
        </div>
    );
};

export default Messages;

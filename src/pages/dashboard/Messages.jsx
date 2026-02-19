
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { FaPaperPlane, FaSearch, FaUser, FaCircle, FaChevronLeft } from 'react-icons/fa';
import { sendEmailNotification, EMAIL_TEMPLATES } from '../../services/email';

const Messages = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const messagesAreaRef = useRef(null);

    // 1. Fetch Conversations on Mount
    useEffect(() => {
        if (user) {
            fetchConversations();

            // Subscribe to any changes in conversations involving me
            const convSubscription = supabase
                .channel('global-conversations')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'conversations',
                    filter: `or(participant1_id.eq.${user.id},participant2_id.eq.${user.id})`
                }, () => {
                    fetchConversations();
                })
                .subscribe();

            // Subscribe to any NEW messages where I am the receiver (for sidebar unread badges + active chat fallback)
            const globalMsgSubscription = supabase
                .channel('global-messages')
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `receiver_id=eq.${user.id}`
                }, async (payload) => {
                    console.log('Realtime: Global Message Received', payload);

                    // Priority: if this is for the active chat, mark as read FIRST
                    if (activeChatRef.current && payload.new.conversation_id === activeChatRef.current.id) {
                        await markAsRead(activeChatRef.current.id);

                        setMessages(prev => {
                            if (prev.some(m => m.id === payload.new.id)) return prev;
                            return [...prev, payload.new];
                        });
                        setTimeout(() => scrollToBottom(true), 100);
                    }

                    // Then fetch conversations to get accurate counts
                    fetchConversations();
                })
                .subscribe((status) => {
                    console.log(`Realtime: Global Subscription Status: ${status}`);
                });

            // 3. Handle window focus to re-sync unread status
            const handleFocus = () => {
                const activeId = activeChatRef.current?.id;
                if (activeId) markAsRead(activeId);
                fetchConversations();
            };
            window.addEventListener('focus', handleFocus);

            return () => {
                supabase.removeChannel(convSubscription);
                supabase.removeChannel(globalMsgSubscription);
                window.removeEventListener('focus', handleFocus);
            };
        }
    }, [user]);

    // Track activeChat in a ref for the focus listener
    const activeChatRef = useRef(null);
    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    // 2. Fetch Messages when Active Chat changes
    useEffect(() => {
        if (activeChat) {
            setMessages([]); // Clear immediately to prevent ghosting
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
                    console.log('Realtime: Active Chat Message Received', payload);
                    if (payload.new.sender_id !== user.id) {
                        setMessages(prev => {
                            if (prev.some(m => m.id === payload.new.id)) return prev;
                            return [...prev, payload.new];
                        });
                        scrollToBottom();
                    }
                })
                .subscribe((status) => {
                    console.log(`Realtime: Chat Subscription Status: ${status}`);
                });

            return () => { supabase.removeChannel(subscription); };
        }
    }, [activeChat]);

    // 3. Handle direct navigation to a chat
    useEffect(() => {
        if (location.state?.conversationId && conversations.length > 0) {
            const selected = conversations.find(c => c.id === location.state.conversationId);
            if (selected) setActiveChat(selected);
        }
    }, [location.state, conversations]);

    const scrollToBottom = (force = false, smooth = true) => {
        if (!messagesAreaRef.current) return;

        // WhatsApp style: auto scroll if already at bottom or if forced (e.g. sent message)
        const scrollArea = messagesAreaRef.current;
        const isNearBottom = scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight < 150;

        if (force || isNearBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
        }
    };

    const fetchConversations = async () => {
        try {
            // 1. Get conversations where user is p1 or p2
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

            // 2. Format data and identify "other user"
            const formatted = data.map(conv => {
                const other = conv.participant1_id === user.id ? conv.p2 : conv.p1;
                return {
                    ...conv,
                    otherUser: other
                };
            });
            setConversations(formatted);
        } catch (error) {
            console.error('Error loading chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (convId) => {
        try {
            await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('conversation_id', convId)
                .eq('receiver_id', user.id)
                .eq('is_read', false);

            // Update local state to clear badge
            setConversations(prev => prev.map(c =>
                c.id === convId ? { ...c, unreadCount: 0 } : c
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const fetchMessages = async (convId) => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true });

        setMessages(data || []);
        await markAsRead(convId); // Mark as read when opened
        setTimeout(() => scrollToBottom(true, false), 50); // Force INSTANT scroll on load
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const text = newMessage;
        setNewMessage(''); // optimistic clear

        const otherUserId = activeChat.participant1_id === user.id ? activeChat.participant2_id : activeChat.participant1_id;

        try {
            // Optimistic update for immediate feedback
            const optimisticMsg = {
                id: Date.now(),
                conversation_id: activeChat.id,
                sender_id: user.id,
                receiver_id: otherUserId,
                content: text,
                created_at: new Date().toISOString()
            };
            setMessages(prev => [...prev, optimisticMsg]);
            setTimeout(() => scrollToBottom(true), 50); // Aggressive auto-scroll for sent message

            // 1. Insert Message
            const { error: msgError } = await supabase.from('messages').insert([{
                conversation_id: activeChat.id,
                sender_id: user.id,
                receiver_id: otherUserId,
                content: text
            }]);

            if (msgError) throw msgError;

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
                                    {chat.otherUser?.avatar_url ? (
                                        <img src={chat.otherUser.avatar_url} alt="User" />
                                    ) : <FaUser />}
                                </div>
                                <div className="convo-info">
                                    <h4>{chat.otherUser?.username || 'Unknown'}</h4>
                                    <div className="bottom-details">
                                        <p className="preview">{chat.last_message || 'Start chatting...'}</p>
                                        <span className="time">
                                            {new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
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
                            <div className="mobile-back" onClick={() => setActiveChat(null)}>
                                <FaChevronLeft />
                            </div>
                            <div className="header-user">
                                <div className="user-avatar sm">
                                    {activeChat.otherUser?.avatar_url ? (
                                        <img src={activeChat.otherUser.avatar_url} alt="User" />
                                    ) : <FaUser />}
                                </div>
                                <h3>{activeChat.otherUser?.username}</h3>
                            </div>
                        </div>

                        <div className="messages-area" ref={messagesAreaRef}>
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
                    height: calc(100vh - 120px);
                    background: #0b0b0b;
                    border: 1px solid #222;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
                }

                /* Sidebar */
                .chat-sidebar {
                    border-right: 1px solid #1a1a1a;
                    display: flex;
                    flex-direction: column;
                    background: #0f0f0f;
                }
                .sidebar-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #1a1a1a;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .sidebar-header h2 { margin: 0; font-size: 1.4rem; color: #fff; font-weight: 800; }
                .search-bar {
                    background: #1a1a1a;
                    display: flex;
                    align-items: center;
                    padding: 0 1rem;
                    border-radius: 12px;
                    gap: 10px;
                    color: #555;
                    border: 1px solid #222;
                }
                .search-bar input {
                    background: transparent;
                    border: none;
                    color: white;
                    padding: 8px 0;
                    width: 100%;
                    outline: none;
                    font-size: 0.85rem;
                }

                .convo-list {
                    flex: 1;
                    overflow-y: auto;
                    scrollbar-width: thin;
                    scrollbar-color: #222 transparent;
                }
                .convo-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 1rem 1.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border-bottom: 1px solid #141414;
                }
                .convo-item:hover {
                    background: #141414;
                }
                .convo-item.active {
                    background: rgba(237, 80, 0, 0.08);
                    position: relative;
                }
                .convo-item.active::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: var(--primary-orange);
                }

                .user-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: #222;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                    flex-shrink: 0;
                    border: 1px solid #333;
                    overflow: hidden;
                }
                .user-avatar img { width: 100%; height: 100%; object-fit: cover; }

                .convo-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
                .convo-info h4 { margin: 0; font-size: 1rem; color: #eee; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .bottom-details { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
                .time { font-size: 0.7rem; color: #555; white-space: nowrap; }
                .preview { margin: 0; font-size: 0.85rem; color: #777; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }

                /* Main Chat */
                .chat-main {
                    display: flex;
                    flex-direction: column;
                    background: #080808;
                    position: relative;
                    height: 100%;
                    overflow: hidden;
                }
                .chat-header {
                    padding: 0.8rem 1.5rem;
                    border-bottom: 1px solid #1a1a1a;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #0f0f0f;
                    z-index: 10;
                }
                .header-user { display: flex; align-items: center; gap: 12px; }
                .user-avatar.sm { width: 36px; height: 36px; border-radius: 50%; }
                .chat-header h3 { margin: 0; font-size: 1.05rem; color: #fff; font-weight: 600; }

                .messages-area {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2rem 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    background-image: radial-gradient(#111 1px, transparent 1px);
                    background-size: 20px 20px;
                    scrollbar-width: thin;
                    scrollbar-color: #333 transparent;
                }
                
                .message-bubble {
                    max-width: 75%;
                    padding: 10px 14px;
                    border-radius: 12px;
                    position: relative;
                    font-size: 0.95rem;
                    line-height: 1.45;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                    word-wrap: break-word;
                }
                .message-bubble.received {
                    align-self: flex-start;
                    background: #1e1e1e;
                    color: #e0e0e0;
                    border-top-left-radius: 2px;
                }
                .message-bubble.sent {
                    align-self: flex-end;
                    background: #d44e00;
                    color: white;
                    border-top-right-radius: 2px;
                }
                
                .msg-time {
                    display: block;
                    font-size: 0.7rem;
                    margin-top: 4px;
                    opacity: 0.6;
                    text-align: right;
                }

                .chat-input-area {
                    padding: 1rem 1.5rem;
                    background: #0f0f0f;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    border-top: 1px solid #1a1a1a;
                }
                .chat-input-area input {
                    flex: 1;
                    background: #1a1a1a;
                    border: 1px solid #222;
                    padding: 12px 18px;
                    border-radius: 24px;
                    color: white;
                    outline: none;
                    font-size: 0.95rem;
                    transition: border-color 0.2s;
                }
                .chat-input-area input:focus { border-color: var(--primary-orange); }
                .chat-input-area button {
                    background: var(--primary-orange);
                    border: none;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    flex-shrink: 0;
                }
                .chat-input-area button:disabled { background: #222; color: #555; cursor: default; }
                .chat-input-area button:hover:not(:disabled) { transform: scale(1.08); background: #f05a00; }
                .chat-input-area button:active:not(:disabled) { transform: scale(0.95); }

                .no-chat-selected {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #333;
                    background: #080808;
                }
                .big-icon { font-size: 5rem; opacity: 0.05; margin-bottom: 1.5rem; }
                .no-chat-selected h3 { margin: 0 0 0.5rem 0; color: #444; font-weight: 700; }
                .no-chat-selected p { margin: 0; color: #333; font-size: 0.95rem; }

                @media (max-width: 900px) {
                    /* Remove DashboardLayout padding on mobile for this page */
                    .content-scrollable { padding: 0 !important; }
                    
                    .messages-layout { 
                        grid-template-columns: 1fr;
                        margin: 0;
                        height: calc(100vh - 64px); 
                        border-radius: 0;
                        border: none;
                        background: #080808;
                        width: 100%;
                    }
                    
                    /* Secondary target for deeper specificity if needed */
                    .main-content .content-scrollable {
                        padding: 0 !important;
                    }

                    .chat-sidebar {
                        display: ${activeChat ? 'none' : 'flex'};
                        width: 100%;
                        border-right: none;
                    }
                    .chat-main {
                        display: ${activeChat ? 'flex' : 'none'};
                        width: 100%;
                        background: #080808;
                    }
                    .chat-header {
                        border-bottom: 1px solid #1a1a1a;
                        padding: 0.8rem 1rem;
                    }
                    .messages-area {
                        padding: 1.5rem 1rem;
                    }
                    .chat-input-area {
                        background: #080808; /* Same as chat area */
                        border-top: none; /* No side lines/bottom lines */
                        padding: 1rem;
                    }
                    .chat-input-area input {
                        background: #151515;
                        border-color: #222;
                    }
                    
                    .sidebar-header { padding: 1rem; }
                    .search-bar, .convo-info, .sidebar-header h2 { display: flex; }
                    .top-row h4 { font-size: 1.1rem; }
                    .convo-item { padding: 1.2rem 1.5rem; gap: 15px; }
                    
                    /* Add a back button for mobile chat */
                    .mobile-back {
                        display: block;
                        margin-right: 15px;
                        font-size: 1.2rem;
                        color: #888;
                        cursor: pointer;
                    }
                }
                @media (min-width: 901px) {
                    .mobile-back { display: none; }
                }
            `}</style>
        </div>
    );
};

export default Messages;

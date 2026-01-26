
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { FaBell } from 'react-icons/fa';

const NotificationBell = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        fetchNotifications();

        // Realtime Subscription
        const subscription = supabase
            .channel('public:notifications')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
                setUnreadCount(prev => prev + 1);
            })
            .subscribe();

        // Close dropdown on click outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            supabase.removeChannel(subscription);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [user]);

    const fetchNotifications = async () => {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        }
    };

    const handleBellClick = () => {
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = async (notif) => {
        if (!notif.is_read) {
            await supabase.from('notifications').update({ is_read: true }).eq('id', notif.id);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
        }
        setIsOpen(false);
        if (notif.link) navigate(notif.link);
    };

    const markAllRead = async () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length > 0) {
            await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        }
    };

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <div className="bell-icon-wrapper" onClick={handleBellClick}>
                <FaBell className="bell-icon" />
                {unreadCount > 0 && <span className="notification-badge news-flash">{unreadCount}</span>}
            </div>

            {isOpen && (
                <div className="notifications-dropdown">
                    <div className="dropdown-header">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && <button onClick={markAllRead}>Mark all read</button>}
                    </div>
                    <div className="notifications-list">
                        {notifications.length === 0 ? (
                            <div className="empty-state">No notifications</div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    <div className="notif-content">
                                        <p>{notif.content}</p>
                                        <span className="time">{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    {!notif.is_read && <div className="unread-dot"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .notification-bell-container {
                    position: relative;
                }
                .bell-icon-wrapper {
                    position: relative;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.2s;
                }
                .bell-icon-wrapper:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .bell-icon {
                    font-size: 1.2rem;
                    color: #fff;
                }
                .notification-badge {
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    background: #e74c3c;
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    font-size: 0.7rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    border: 2px solid #000;
                }

                .news-flash {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
                    70% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(231, 76, 60, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
                }

                .notifications-dropdown {
                    position: absolute;
                    top: 50px;
                    right: -10px; /* Adjust alignment */
                    width: 320px;
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    z-index: 1000;
                    overflow: hidden;
                }

                .dropdown-header {
                    padding: 12px 16px;
                    border-bottom: 1px solid #222;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #1a1a1a;
                }
                .dropdown-header h4 { margin: 0; font-size: 0.95rem; color: #fff; }
                .dropdown-header button {
                    background: none;
                    border: none;
                    color: var(--primary-orange);
                    font-size: 0.75rem;
                    cursor: pointer;
                }

                .notifications-list {
                    max-height: 350px;
                    overflow-y: auto;
                }

                .notification-item {
                    padding: 12px 16px;
                    border-bottom: 1px solid #222;
                    cursor: pointer;
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    transition: background 0.2s;
                }
                .notification-item:hover { background: #161616; }
                .notification-item.unread { background: rgba(237, 80, 0, 0.05); }

                .notif-content p { margin: 0 0 4px 0; font-size: 0.9rem; color: #ddd; line-height: 1.4; }
                .notif-content .time { font-size: 0.75rem; color: #666; }
                
                .unread-dot {
                    width: 8px;
                    height: 8px;
                    background: var(--primary-orange);
                    border-radius: 50%;
                    margin-top: 6px;
                }
                .empty-state {
                    padding: 2rem;
                    text-align: center;
                    color: #666;
                    font-size: 0.9rem;
                }
            `}</style>
        </div>
    );
};

export default NotificationBell;

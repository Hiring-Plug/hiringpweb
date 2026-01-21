import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaBriefcase, FaUser, FaCog, FaSignOutAlt, FaBars, FaBell, FaComments, FaBolt, FaPlusCircle } from 'react-icons/fa';

const DashboardLayout = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const role = user?.user_metadata?.role || 'talent'; // Default to talent if undefined

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const navItems = role === 'project' ? [
        { path: '/app/dashboard', icon: <FaHome />, label: 'Overview' },
        { path: '/app/freelance', icon: <FaPlusCircle />, label: 'Post a Gig' },
        { path: '/app/messages', icon: <FaComments />, label: 'Messages' },
        { path: '/app/profile', icon: <FaUser />, label: 'Company Profile' },
        { path: '/app/settings', icon: <FaCog />, label: 'Settings' },
    ] : [
        { path: '/app/dashboard', icon: <FaHome />, label: 'Overview' },
        { path: '/app/projects', icon: <FaBriefcase />, label: 'Browse Projects' },
        { path: '/app/freelance', icon: <FaBolt />, label: 'Fast Gigs' },
        { path: '/app/messages', icon: <FaComments />, label: 'Messages' },
        { path: '/app/profile', icon: <FaUser />, label: 'My Profile' },
        { path: '/app/settings', icon: <FaCog />, label: 'Settings' },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Get current page title for Breadcrumb
    const getPageTitle = () => {
        const current = navItems.find(item => item.path === location.pathname);
        return current ? current.label : 'Dashboard';
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        H<span className="accent">P</span> <span className="logo-text">Console</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="icon">{item.icon}</span>
                            <span className="label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleSignOut} className="nav-item logout-btn">
                        <span className="icon"><FaSignOutAlt /></span>
                        <span className="label">Sign Out</span>
                    </button>
                    <div className="user-mini-profile">
                        <div className="avatar">
                            {user?.user_metadata?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="user-info">
                            <span className="username">{user?.user_metadata?.username || 'User'}</span>
                            <span className="role-badge">Member</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Topbar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <button className="toggle-btn" onClick={toggleSidebar}>
                            <FaBars />
                        </button>
                        <div className="breadcrumbs">
                            <span className="crumb-root">App</span> / <span className="crumb-page">{getPageTitle()}</span>
                        </div>
                    </div>
                    <div className="topbar-right">
                        <div className="env-badge">
                            <span className="dot"></span> Production
                        </div>
                        <button className="icon-btn"><FaBell /></button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="content-scrollable">
                    <Outlet />
                </div>
            </main>

            <style>{`
                .dashboard-layout {
                    display: flex;
                    height: 100vh;
                    background: #000;
                    color: #fff;
                    overflow: hidden;
                }

                /* Sidebar */
                .sidebar {
                    width: 260px;
                    background: #0a0a0a;
                    border-right: 1px solid #222;
                    display: flex;
                    flex-direction: column;
                    transition: width 0.3s ease;
                    flex-shrink: 0;
                }
                .sidebar.closed {
                    width: 80px;
                }
                .sidebar.closed .logo-text,
                .sidebar.closed .label,
                .sidebar.closed .user-info {
                    display: none;
                }
                .sidebar.closed .sidebar-header {
                    justify-content: center;
                }

                .sidebar-header {
                    height: 64px;
                    display: flex;
                    align-items: center;
                    padding: 0 1.5rem;
                    border-bottom: 1px solid #1a1a1a;
                }
                .logo {
                    font-size: 1.2rem;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                }
                .accent { color: var(--primary-orange); }

                .sidebar-nav {
                    flex: 1;
                    padding: 1.5rem 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.8rem 1rem;
                    border-radius: 8px;
                    color: #888;
                    text-decoration: none;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                    background: none;
                    cursor: pointer;
                    font-size: 0.95rem;
                    width: 100%;
                }
                .nav-item:hover {
                    background: #111;
                    color: #fff;
                }
                .nav-item.active {
                    background: #161616;
                    color: #fff;
                    border-color: #333;
                }
                .nav-item .icon {
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .sidebar-footer {
                    padding: 1rem;
                    border-top: 1px solid #1a1a1a;
                }
                .user-mini-profile {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 1rem;
                    padding: 0.5rem;
                }
                .avatar {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #111, #222);
                    border: 1px solid #333;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    color: var(--primary-orange);
                    flex-shrink: 0;
                }
                .user-info {
                    display: flex;
                    flex-direction: column;
                }
                .username {
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                .role-badge {
                    font-size: 0.7rem;
                    color: #666;
                    text-transform: uppercase;
                }

                /* Main Content */
                .main-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: #000;
                }

                /* Topbar */
                .topbar {
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2rem;
                    border-bottom: 1px solid #1a1a1a;
                    background: #0a0a0a;
                }
                .topbar-left {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .toggle-btn {
                    background: none;
                    border: none;
                    color: #888;
                    cursor: pointer;
                    font-size: 1.1rem;
                }
                .breadcrumbs {
                    color: #666;
                    font-size: 0.9rem;
                }
                .crumb-page {
                    color: #fff;
                    font-weight: 500;
                }

                .topbar-right {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .env-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    padding: 4px 10px;
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 50px;
                    color: #aaa;
                }
                .dot {
                    width: 6px;
                    height: 6px;
                    background: #4cd137;
                    border-radius: 50%;
                    box-shadow: 0 0 5px #4cd137;
                }
                .icon-btn {
                    background: none;
                    border: none;
                    color: #888;
                    cursor: pointer;
                    font-size: 1.1rem;
                    transition: color 0.2s;
                }
                .icon-btn:hover { color: #fff; }

                /* Page Content */
                .content-scrollable {
                    flex: 1;
                    padding: 2rem;
                    overflow-y: auto;
                }

                @media (max-width: 768px) {
                    .sidebar {
                        position: fixed;
                        z-index: 1000;
                        height: 100%;
                        width: 260px;
                        transform: translateX(-100%);
                    }
                    .sidebar.open {
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;

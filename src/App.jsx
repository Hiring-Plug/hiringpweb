import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Solutions from './pages/Solutions'
import Resources from './pages/Resources'
import Admin from './pages/Admin'
import Communities from './pages/Communities'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Litepaper from './pages/Litepaper'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Profile from './pages/dashboard/Profile'
import PublicProfile from './pages/PublicProfile'
import Messages from './pages/dashboard/Messages'
import Freelance from './pages/dashboard/Freelance'
import AppProjects from './pages/dashboard/AppProjects'
import Jobs from './pages/dashboard/Jobs'
import JobDetail from './pages/dashboard/JobDetail'
import Applications from './pages/dashboard/Applications'
import Settings from './pages/dashboard/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from './components/ScrollToTop'
import { DataProvider } from './context/DataContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ConfirmProvider } from './components/ConfirmDialog'
import { useAuth } from './context/AuthContext'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { config } from './utils/wagmi'

const queryClient = new QueryClient()

// Sub-component to handle global redirects, placed INSIDE AuthProvider
function AuthRedirectHandler() {
  const auth = useAuth();
  
  if (!auth) return null;

  const { user, loading } = auth;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!loading) {
      console.log(`[Redirect-Check] user: ${!!user}, path: ${pathname}, loading: ${loading}`);
      // Global redirect for authenticated users landing on entrance pages (Login/Signup)
      if (user && (pathname === '/login' || pathname === '/signup')) {
        console.log("[Redirect-Trigger] Authenticated user on auth page. Pushing to /app/profile");
        navigate('/app/profile');
      }
    }
  }, [user, loading, pathname, navigate]);

  return null;
}

function App() {
  const { pathname } = useLocation();
  const [isConfigured, setIsConfigured] = useState(!!supabase);

  if (!isConfigured) {
    return (
      <div style={{
        backgroundColor: '#000',
        color: '#fff',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h1 style={{ color: '#ED5000', marginBottom: '1rem' }}>Configuration Missing</h1>
        <p style={{ maxWidth: '600px', lineHeight: '1.6', color: '#888' }}>
          Sustainable environment variables are missing. Please add <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> to your environment settings.
        </p>
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#111', textAlign: 'left' }}>
          <code style={{ fontSize: '0.9rem' }}>
            // Required Variables:<br />
            VITE_SUPABASE_URL=your_project_url<br />
            VITE_SUPABASE_ANON_KEY=your_anon_key
          </code>
        </div>
        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#444' }}>
          After adding these variables, please redeploy your application.
        </p>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#ED5000',
          accentColorForeground: 'white',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'small',
        })}>
          <ErrorBoundary>
            <DataProvider>
              <AuthProvider>
                <AuthRedirectHandler />
                <ToastProvider>
                  <ConfirmProvider>
                    <ScrollToTop />
                    <div className="app-container">
                      {/* Hide Navbar/Footer for Admin AND Dashboard routes to give full app feel */}
                      {!pathname.startsWith('/admin') && !pathname.startsWith('/app') && <Navbar />}

                      <main style={{ minHeight: '80vh' }}>
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<Home />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/solutions" element={<Solutions />} />
                          <Route path="/resources" element={<Resources />} />
                          <Route path="/projects" element={<Projects />} />

                          <Route path="/communities" element={<Communities />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<Signup />} />
                          <Route path="/litepaper" element={<Litepaper />} />
                          <Route path="/u/:username" element={<PublicProfile />} />

                          {/* Protected App Routes */}
                          <Route path="/app" element={
                            <ProtectedRoute>
                              <DashboardLayout />
                            </ProtectedRoute>
                          }>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="messages" element={<Messages />} />
                            <Route path="freelance" element={<Freelance />} />
                            <Route path="projects" element={<AppProjects />} />
                            <Route path="jobs" element={<Jobs />} />
                            <Route path="jobs/:id" element={<JobDetail />} />
                            <Route path="applications" element={<Applications />} />
                            <Route path="settings" element={<Settings />} />
                            {/* Redirect /app to /app/dashboard */}
                            <Route index element={<Navigate to="dashboard" replace />} />
                          </Route>

                          {/* Admin Routes */}
                          <Route path="/admin" element={<Admin />} />
                        </Routes>
                      </main>
                      {!pathname.startsWith('/admin') && !pathname.startsWith('/app') && pathname !== '/litepaper' && <Footer />}
                    </div>
                  </ConfirmProvider>
                </ToastProvider>
              </AuthProvider>
            </DataProvider>
          </ErrorBoundary>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App

import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Join from './pages/Join'
import Solutions from './pages/Solutions'
import Resources from './pages/Resources'
import Admin from './pages/Admin'
import Communities from './pages/Communities'
import Login from './pages/Login'
import Signup from './pages/Signup'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Profile from './pages/dashboard/Profile'
import Messages from './pages/dashboard/Messages'
import Freelance from './pages/dashboard/Freelance'
import AppProjects from './pages/dashboard/AppProjects'
import Jobs from './pages/dashboard/Jobs'
import JobDetail from './pages/dashboard/JobDetail'
import Applications from './pages/dashboard/Applications'
import ProtectedRoute from './components/ProtectedRoute'
import { DataProvider } from './context/DataContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthProvider>
      <DataProvider>
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
              <Route path="/join" element={<Join />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

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
                {/* Redirect /app to /app/dashboard */}
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          {!pathname.startsWith('/admin') && !pathname.startsWith('/app') && <Footer />}
        </div>
      </DataProvider>
    </AuthProvider>
  )
}

export default App

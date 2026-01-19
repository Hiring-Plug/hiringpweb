import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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
          {pathname !== '/admin' && <Navbar />}
          <main style={{ minHeight: '80vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/join" element={<Join />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
          {pathname !== '/admin' && <Footer />}
        </div>
      </DataProvider>
    </AuthProvider>
  )
}

export default App

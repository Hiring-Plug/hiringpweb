import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Join from './pages/Join'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main style={{ minHeight: '80vh', paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/join" element={<Join />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

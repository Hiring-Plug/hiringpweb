import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/banner-dark-transparent.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        // Scrolling down & passed header
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Solutions', path: '/' }, // Placeholder
    { title: 'Resources', path: '/' }, // Placeholder
    { title: 'Projects', path: '/projects' },
    { title: 'Applicants', path: '/join' }
  ];

  return (
    <nav className={`navbar ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="nav-container">
        {/* Left: Logo */}
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <img src={logo} alt="Hiring Plug" className="logo-img" />
        </Link>

        {/* Center: Desktop Links */}
        <div className="nav-links-container">
          {navLinks.map((link, index) => (
            <Link key={index} to={link.path} className="nav-link">
              {link.title}
            </Link>
          ))}
        </div>

        {/* Right: Auth Buttons */}
        <div className="nav-auth">
          <Link to="/" className="btn-login">Log in</Link>
          <Link to="/join" className="btn-signup">Sign up</Link>
        </div>

        {/* Mobile Toggle */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-list">
          {navLinks.map((link, index) => (
            <li key={index} className="mobile-nav-item">
              <Link to={link.path} className="mobile-nav-link" onClick={toggleMenu}>
                {link.title}
              </Link>
            </li>
          ))}
          <li className="mobile-nav-item">
            <Link to="/" className="mobile-nav-link" onClick={toggleMenu}>Log in</Link>
          </li>
          <li className="mobile-nav-item">
            <Link to="/join" className="mobile-btn-signup" onClick={toggleMenu}>Sign up</Link>
          </li>
        </ul>
      </div>

      <style>{`
        .navbar {
          background: rgba(0, 0, 0, 0.2); /* More transparent */
          backdrop-filter: blur(5px); /* Reduced blur */
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: transform 0.3s ease-in-out;
        }

        .navbar.hidden {
            transform: translateY(-100%);
        }

        .navbar.visible {
            transform: translateY(0);
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1400px;
          padding: 0 40px;
          height: 100%;
        }

        .logo-img {
            height: 32px;
            width: auto;
            display: block;
        }

        /* Center Links */
        .nav-links-container {
            display: flex;
            gap: 32px;
            align-items: center;
        }

        .nav-link {
            color: #e0e0e0;
            font-size: 0.95rem;
            font-weight: 400;
            transition: color 0.2s ease;
            position: relative; /* Needed for ::after positioning */
            padding-bottom: 4px; /* Space for the line */
        }

        .nav-link:hover {
            color: #ffffff;
            text-shadow: 0 0 8px var(--primary-orange);
        }

        .nav-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: 0;
            left: 50%;
            background-color: var(--primary-orange);
            transition: all 0.3s ease;
            box-shadow: 0 0 8px var(--primary-orange);
            transform: translateX(-50%);
        }

        .nav-link:hover::after {
            width: 100%;
        }

        /* Right Auth */
        .nav-auth {
            display: flex;
            gap: 24px;
            align-items: center;
        }

        .btn-login {
            color: #ffffff;
            font-weight: 500;
            font-size: 0.9rem;
            transition: all 0.2s ease;
            padding: 8px 16px;
            border-radius: 6px;
        }
        
        .btn-login:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.1);
            color: var(--primary-orange);
            text-shadow: 0 0 8px rgba(237, 80, 0, 0.5);
        }

        .btn-signup {
            background-color: var(--primary-orange);
            color: #ffffff;
            padding: 8px 20px;
            border-radius: 6px; /* Rounded rectangle */
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            border: 2px solid var(--primary-orange);
        }

        .btn-signup:hover {
            background-color: transparent;
            color: var(--primary-orange);
            box-shadow: 0 0 15px rgba(237, 80, 0, 0.4);
            transform: translateY(-1px);
        }

        .menu-icon {
          display: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 1001;
        }

        /* Mobile Menu */
        .mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: #000000;
            transform: translateY(-100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-top: 60px;
        }

        .mobile-menu.active {
            transform: translateY(0);
        }

        .mobile-nav-list {
            list-style: none;
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .mobile-nav-link {
            color: white;
            font-size: 1.5rem;
            font-weight: 500;
            display: block;
        }

        .mobile-btn-signup {
            background: white;
            color: black;
            padding: 12px 32px;
            border-radius: 999px;
            font-weight: 600;
            font-size: 1.2rem;
            display: inline-block;
        }
        
        /* Responsive */
        @media screen and (max-width: 960px) {
            .nav-links-container, .nav-auth {
                display: none;
            }
            
            .menu-icon {
                display: block;
            }

            .nav-container {
                padding: 0 24px;
            }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

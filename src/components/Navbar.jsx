import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo-light.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Hiring Plug" style={{ height: '40px' }} />
        </Link>
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links" onClick={toggleMenu}>
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/projects" className="nav-links" onClick={toggleMenu}>
              Projects
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/join" className="nav-cta" onClick={toggleMenu}>
              Join Network
            </Link>
          </li>
        </ul>
      </div>
      <style>{`
        .navbar {
          background: #000;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.2rem;
          position: sticky;
          top: 0;
          z-index: 999;
          border-bottom: 1px solid #333;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 80px;
          max-width: 1500px;
          width: 100%;
          margin: 0 auto;
          padding: 0 50px;
        }

        .nav-logo {
          color: #fff;
          justify-self: start;
          cursor: pointer;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .highlight {
            color: var(--primary-orange);
        }

        .nav-menu {
          display: grid;
          grid-template-columns: repeat(4, auto);
          grid-gap: 10px;
          list-style: none;
          text-align: center;
          width: 70vw;
          justify-content: end;
          margin-right: 2rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          height: 80px;
        }

        .nav-links {
          color: white;
          text-decoration: none;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
        }

        .nav-links:hover {
          color: var(--primary-orange);
        }

        .nav-cta {
          padding: 0.5rem 1rem;
          background: var(--primary-orange);
          color: white;
          border-radius: 4px;
          text-decoration: none;
          margin-left: 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .nav-cta:hover {
            background: var(--secondary-yellow);
            color: black;
        }

        .menu-icon {
          display: none;
        }

        @media screen and (max-width: 960px) {
          .nav-container {
             padding: 0 20px;
          }
          
          .nav-menu {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 90vh;
            position: absolute;
            top: 80px;
            left: -100%;
            opacity: 1;
            transition: all 0.5s ease;
            background: #1a1a1a;
          }

          .nav-menu.active {
            background: #1a1a1a;
            left: 0;
            opacity: 1;
            transition: all 0.5s ease;
            z-index: 1;
          }

          .nav-item {
              height: auto;
              padding: 2rem 0;
          }

          .nav-links {
            text-align: center;
            padding: 2rem;
            width: 100%;
            display: table;
          }

          .menu-icon {
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(-100%, 60%);
            font-size: 1.8rem;
            cursor: pointer;
            color: white;
          }
          
          .nav-cta {
              margin: 0;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

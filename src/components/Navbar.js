import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [appsDropdown, setAppsDropdown] = useState(false);
  const navigate = useNavigate();

  // Handle scroll hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        setIsVisible(true);
      } else if (currentScroll > lastScrollTop && currentScroll > 100) {
        // Scrolling DOWN
        setIsVisible(false);
      } else {
        // Scrolling UP
        setIsVisible(true);
      }

      setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    onLogout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar-container ${isVisible ? 'navbar-visible' : 'navbar-hidden'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="container">
        <div className="navbar">
          <div className="navbar-brand">
            <Link to="/" className="brand-link">
              <span className="brand-name">Akagera Inc</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            
            {/* Apps Dropdown */}
            <li className="dropdown" onMouseEnter={() => setAppsDropdown(true)} onMouseLeave={() => setAppsDropdown(false)}>
              <Link to="/apps" className="dropdown-toggle">
                Apps <ChevronDown size={16} className={appsDropdown ? 'rotate' : ''} />
              </Link>
              <ul className={`dropdown-menu ${appsDropdown ? 'active' : ''}`}>
                <li><Link to="/apps">All Apps</Link></li>
                <li><Link to="/apps?filter=mobile">Mobile Apps</Link></li>
                <li><Link to="/apps?filter=web">Web Apps</Link></li>
                <li><Link to="/apps?filter=premium">Premium Apps</Link></li>
              </ul>
            </li>

            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>

          {/* Authentication Buttons */}
          <div className="navbar-auth">
            {user ? (
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
                title="Go to Dashboard"
              >
                <i className="fas fa-user-circle"></i> Dashboard
              </button>
            ) : (
              <Link to="/" className="btn btn-primary">
                <i className="fas fa-sign-in-alt"></i> Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <ul className="mobile-navbar-links">
              <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
              <li><Link to="/apps" onClick={() => setMobileMenuOpen(false)}>All Apps</Link></li>
              <li><Link to="/apps?filter=mobile" onClick={() => setMobileMenuOpen(false)}>Mobile Apps</Link></li>
              <li><Link to="/apps?filter=web" onClick={() => setMobileMenuOpen(false)}>Web Apps</Link></li>
              <li><Link to="/services" onClick={() => setMobileMenuOpen(false)}>Services</Link></li>
              <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
            </ul>
            <div className="mobile-auth">
              {user ? (
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    navigate('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  style={{ width: '100%' }}
                >
                  <i className="fas fa-user-circle"></i> Dashboard
                </button>
              ) : (
                <Link to="/" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                  <i className="fas fa-sign-in-alt"></i> Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

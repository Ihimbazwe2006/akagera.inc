import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './index.css';

// Pages and Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import Apps from './pages/Apps';
import AppDetails from './pages/AppDetails';
import Services from './pages/Services';
import Payment from './pages/Payment';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import Toast from './components/Toast';
import BottomSheet from './components/BottomSheet';
import GoogleAuthButton from './components/GoogleAuthButton';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(!!localStorage.getItem('cookieConsent'));
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize AOS and check user session
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });

    // Check if user is logged in (from localStorage or session)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!user && !loading && cookieAccepted) {
      setShowBottomSheet(true);
    } else {
      setShowBottomSheet(false);
    }
  }, [user, loading, cookieAccepted]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    showToast('Successfully logged in!');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    showToast('Logged out successfully');
  };

  const handleVisitMode = () => {
    setShowBottomSheet(false);
  };

  useEffect(() => {
    const onStorage = () => {
      setCookieAccepted(!!localStorage.getItem('cookieConsent'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} />

      <BottomSheet open={showBottomSheet} onClose={handleVisitMode}>
        <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',paddingTop:40}}>
          <div style={{
            color:'#444',
            fontSize:'1.08rem',
            textAlign:'center',
            maxWidth:600,
            margin:'0 auto 32px',
            fontWeight:400
          }}>
            To access and enjoy all services provided by AkageraInc, users are required to log in first. Creating an account or signing into your existing account helps us provide a secure, personalized, and better experience for every user. By logging in, you can manage your activities, access exclusive features, track your information safely, and receive important updates related to our services. AkageraInc values the privacy and security of all users, which is why authentication is necessary before using the platform. Please log in with your correct credentials to continue and fully explore the services and opportunities available on AkageraInc.
          </div>
          <div style={{width:300,marginTop:'auto',display:'flex',flexDirection:'column',gap:16}}>
            <GoogleAuthButton onLogin={handleLogin} />
            <button className="btn btn-secondary btn-large" style={{marginTop:8,width:300}} onClick={handleVisitMode}>Continue in Visiting Mode</button>
          </div>
        </div>
      </BottomSheet>

      <main>
        <Routes>
          <Route path="/" element={<Home onLogin={handleLogin} />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/:id" element={<AppDetails />} />
          <Route path="/services" element={<Services showToast={showToast} />} />
          <Route path="/payment" element={<Payment user={user} showToast={showToast} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Home onLogin={handleLogin} />} />
          <Route path="/admin-panel-xyz123" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      <CookieConsent />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;

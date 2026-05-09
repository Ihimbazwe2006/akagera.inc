import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './index.css';

// Pages and Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Apps from './pages/Apps';
import AppDetails from './pages/AppDetails';
import Services from './pages/Services';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import Toast from './components/Toast';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const location = useLocation();

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

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    showToast('Successfully logged in!');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    showToast('Logged out successfully');
  };

  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main>
        <Routes>
          <Route path="/" element={<Home onLogin={handleLogin} />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/:id" element={<AppDetails />} />
          <Route path="/services" element={<Services showToast={showToast} />} />
          <Route path="/payment" element={<Payment user={user} showToast={showToast} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Home onLogin={handleLogin} />} />
          <Route path="/admin-panel-xyz123" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

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

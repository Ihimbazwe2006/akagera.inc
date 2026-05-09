import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './CookieConsent.css';

function CookieConsent() {
  const [showCookie, setShowCookie] = useState(false);

  useEffect(() => {
    // Check if user has already accepted or rejected cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show cookie banner after a short delay for smooth appearance
      setTimeout(() => setShowCookie(true), 500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookie(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowCookie(false);
  };

  if (!showCookie) return null;

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-container">
        {/* Close Button */}
        <button 
          className="cookie-close-btn"
          onClick={handleReject}
          aria-label="Close cookie consent"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="cookie-content">
          <div className="cookie-icon">🍪</div>
          <div className="cookie-text">
            <h3 style={{ margin: '0 0 12px 0', color: '#0B3C5D', fontSize: '1.1rem', fontWeight: '600' }}>
              Cookie Policy
            </h3>
            <p>
              Akagera Inc uses cookies to enhance your browsing experience, analyze website traffic, and personalize content based on your preferences. Cookies help us understand how visitors interact with our site so we can improve performance, functionality, and user experience. Some cookies are essential for the website to function properly, while others are optional and used for analytics and marketing purposes. By continuing to use our website, you agree to the use of cookies as described in our policy.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="cookie-buttons">
          <button 
            className="cookie-btn cookie-btn-reject"
            onClick={handleReject}
          >
            Reject
          </button>
          <button 
            className="cookie-btn cookie-btn-accept"
            onClick={handleAccept}
          >
            Accept All
          </button>
        </div>

        {/* Footer Info */}
        <div className="cookie-footer">
          <a href="#privacy" style={{ color: '#0B3C5D', textDecoration: 'none', fontSize: '0.85rem' }}>
            Learn more about our cookies policy
          </a>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;

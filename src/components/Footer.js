import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Akagera Inc</h3>
            <p>Smart Mobile Solutions - Building innovative applications for All peoples and Rwandan entrepreneurs and businesses.</p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
              <a href="#" title="Facebook" style={{ color: 'var(--secondary-red)' }}>
                <Facebook size={20} />
              </a>
              <a href="#" title="Twitter" style={{ color: 'var(--secondary-red)' }}>
                <Twitter size={20} />
              </a>
              <a href="#" title="LinkedIn" style={{ color: 'var(--secondary-red)' }}>
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/apps">Apps</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="#contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Mail size={20} style={{ color: 'var(--secondary-red)', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <a href="mailto:akagerainc@gmail.com">akagerainc@gmail.com</a>
                </div>
              </li>
              <li style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Phone size={20} style={{ color: 'var(--secondary-red)', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <a href="tel:+250795226123">+250 795 226 123</a>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={20} style={{ color: 'var(--secondary-red)', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <p>Kigali, Rwanda</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="mailto:support@akagerainc.com">Technical Support</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Documentation</a></li>
              <li>
                <a href="https://wa.me/250795226123" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} style={{ display: 'inline', marginRight: '5px' }} />
                  WhatsApp Chat
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Akagera Inc. All rights reserved. | Smart Mobile Solutions</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

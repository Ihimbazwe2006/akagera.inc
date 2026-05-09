import React, { useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter, Globe, Send } from 'lucide-react';

function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handlePhoneClick = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleSocialClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Page Header */}
      <section style={{
        background: 'linear-gradient(135deg, #0B3C5D 0%, #1a5a7f 100%)',
        color: 'white',
        padding: '80px 20px 60px',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', fontWeight: '700' }} data-aos="fade-down">
            Get In Touch
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.95, maxWidth: '600px', margin: '0 auto' }} data-aos="fade-up">
            We'd love to hear from you. Reach out to us through any of the channels below or fill out the contact form.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '60px 20px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}>
            {/* Contact Info Card */}
            <div data-aos="fade-right">
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                height: '100%'
              }}>
                <h2 style={{ marginBottom: '30px', color: '#0B3C5D', fontSize: '1.5rem', fontWeight: '600' }}>
                  Contact Information
                </h2>

                {/* Email */}
                <div style={{ marginBottom: '25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <Mail size={24} style={{ color: '#0B3C5D' }} />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#333' }}>Email</h3>
                  </div>
                  <p style={{ margin: '0 0 8px 36px', color: '#666' }}>
                    <button
                      onClick={() => handleEmailClick('info@akagerainc.com')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0B3C5D',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '1rem'
                      }}
                    >
                      info@akagerainc.com
                    </button>
                  </p>
                  <p style={{ margin: '0 0 0 36px', color: '#666' }}>
                    <button
                      onClick={() => handleEmailClick('support@akagerainc.com')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0B3C5D',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '1rem'
                      }}
                    >
                      support@akagerainc.com
                    </button>
                  </p>
                </div>

                {/* Phone */}
                <div style={{ marginBottom: '25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <Phone size={24} style={{ color: '#0B3C5D' }} />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#333' }}>Phone</h3>
                  </div>
                  <p style={{ margin: '0 0 0 36px', color: '#666' }}>
                    <button
                      onClick={() => handlePhoneClick('+250795226123')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0B3C5D',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '1rem'
                      }}
                    >
                      +250 795 226 123
                    </button>
                  </p>
                </div>

                {/* Location */}
                <div style={{ marginBottom: '25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <MapPin size={24} style={{ color: '#0B3C5D' }} />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#333' }}>Location</h3>
                  </div>
                  <p style={{ margin: '0 0 0 36px', color: '#666', lineHeight: '1.6' }}>
                    Musanze, Rwanda<br/>
                    Innovation Hub<br/>
                    Africa
                  </p>
                </div>

                {/* Website */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <Globe size={24} style={{ color: '#0B3C5D' }} />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#333' }}>Website</h3>
                  </div>
                  <p style={{ margin: '0 0 0 36px', color: '#666' }}>
                    <a
                      href="https://akagera-inc.onrender.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#0B3C5D', textDecoration: 'none' }}
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                      akagera-inc.onrender.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div data-aos="fade-left">
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                height: '100%'
              }}>
                <h2 style={{ marginBottom: '30px', color: '#0B3C5D', fontSize: '1.5rem', fontWeight: '600' }}>
                  Follow Us
                </h2>
                <p style={{ color: '#666', marginBottom: '25px' }}>
                  Connect with Akagera Inc on social media for the latest updates and announcements.
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '15px'
                }}>
                  {/* LinkedIn */}
                  <button
                    onClick={() => handleSocialClick('https://www.linkedin.com/in/ihimbazwe-yves-46b99b379')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '15px',
                      background: '#0A66C2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#095197';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#0A66C2';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Linkedin size={20} />
                    LinkedIn
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => handleSocialClick('https://facebook.com/akagerainc')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '15px',
                      background: '#1877F2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0a66c2';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#1877F2';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Facebook size={20} />
                    Facebook
                  </button>

                  {/* Twitter/X */}
                  <button
                    onClick={() => handleSocialClick('https://twitter.com/ihimbazwe_83888')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '15px',
                      background: '#000000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#333333';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#000000';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Twitter size={20} />
                    X (Twitter)
                  </button>

                  {/* Website */}
                  <button
                    onClick={() => handleSocialClick('https://akagera-inc.onrender.com')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '15px',
                      background: '#0B3C5D',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#092a44';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#0B3C5D';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Globe size={20} />
                    Website
                  </button>
                </div>

                {/* Business Hours */}
                <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #eee' }}>
                  <h3 style={{ color: '#0B3C5D', marginBottom: '15px', fontSize: '1rem', fontWeight: '600' }}>
                    Business Hours
                  </h3>
                  <p style={{ color: '#666', margin: '0 0 8px 0' }}>
                    <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM
                  </p>
                  <p style={{ color: '#666', margin: '0 0 8px 0' }}>
                    <strong>Saturday:</strong> 10:00 AM - 4:00 PM
                  </p>
                  <p style={{ color: '#666', margin: '0' }}>
                    <strong>Sunday:</strong> Closed
                  </p>
                  <p style={{ color: '#999', margin: '10px 0 0 0', fontSize: '0.9rem' }}>
                    (Rwanda Time Zone - UTC+2)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div style={{
            background: 'linear-gradient(135deg, #0B3C5D 0%, #1a5a7f 100%)',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            color: 'white'
          }} data-aos="fade-up">
            <Send size={48} style={{ margin: '0 auto 20px', opacity: 0.9 }} />
            <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', fontWeight: '700' }}>
              Ready to Get Started?
            </h2>
            <p style={{ fontSize: '1.05rem', opacity: 0.95, maxWidth: '600px', margin: '0 auto 30px', lineHeight: '1.6' }}>
              Reach out to us today and let's discuss how Akagera Inc can help transform your business with innovative digital solutions.
            </p>
            <a
              href="mailto:info@akagerainc.com"
              style={{
                display: 'inline-block',
                padding: '15px 40px',
                background: 'white',
                color: '#0B3C5D',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Send us an Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;

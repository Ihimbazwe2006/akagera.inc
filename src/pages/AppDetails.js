
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Lock, Check } from 'lucide-react';
import { appAPI } from '../api';

// Helper to build image URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://akagerainc.onrender.com/api';
const UPLOADS_URL = API_BASE_URL.replace('/api', '');
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${UPLOADS_URL}/uploads/${imagePath}`;
};

function AppDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);


  useEffect(() => {
    const fetchApp = async () => {
      try {
        const response = await appAPI.getById(id);
        // Defensive: ensure features and installation_steps are arrays
        let data = response.data;
        if (!Array.isArray(data.features)) data.features = data.features ? [data.features].flat() : [];
        if (!Array.isArray(data.installation_steps)) data.installation_steps = [];
        setApp(data);
        setError(null);
        setShowSnackbar(false);
        console.log('App details:', data); // Debug log
      } catch (err) {
        console.error('Error fetching app:', err);
        setError(err?.response?.data?.detail || err.message || 'Unknown error');
        setShowSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Snackbar component
  const Snackbar = ({ message, onClose }) => (
    <div style={{
      position: 'fixed',
      bottom: 30,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#ff6b6b',
      color: 'white',
      padding: '16px 32px',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      zIndex: 9999,
      fontWeight: 600,
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }}>
      <span>⚠️ {message}</span>
      <button onClick={onClose} style={{ marginLeft: 16, background: 'none', border: 'none', color: 'white', fontWeight: 700, fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
    </div>
  );

  if (!app) {
    return (
      <>
        <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--primary-blue)', marginBottom: '20px' }}>App Not Found</h2>
            {error && <div style={{ color: '#ff6b6b', marginBottom: 16, fontWeight: 600 }}>{error}</div>}
            <button className="btn btn-primary" onClick={() => navigate('/apps')}>
              Back to Apps
            </button>
          </div>
        </div>
        {showSnackbar && error && <Snackbar message={error} onClose={() => setShowSnackbar(false)} />}
      </>
    );
  }

  return (
    <>
      <div style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '100px', paddingBottom: '40px' }}>
        <div className="container">
          {/* Back Button */}
          <button
            className="btn btn-outline"
            onClick={() => navigate('/apps')}
            style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={18} />
            Back to Apps
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
            {/* App Image */}
            <div
              className="app-card-image"
              style={{ height: '400px', borderRadius: '12px', overflow: 'hidden', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
            >
              {app.app_image ? (
                <img 
                  src={getImageUrl(app.app_image)}
                  alt={app.name}
                  style={{ width: '80%', height: '80%', objectFit: 'cover', borderRadius: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML += '<div style="font-size:150px;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">📱</div>'; }}
                />
              ) : (
                <div style={{ fontSize: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>📱</div>
              )}
            </div>

            {/* App Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <h1 style={{ color: 'var(--primary-blue)', marginBottom: 0, fontFamily: "'Montserrat', sans-serif", fontSize: '2.5rem', fontWeight: 700 }}>{app.name}</h1>
                {app.requires_license && (
                  <span className="app-badge">Requires License</span>
                )}
                {!app.requires_license && (
                  <span className="app-badge" style={{ backgroundColor: 'var(--success)' }}>
                    Free
                  </span>
                )}
              </div>

              <p style={{ fontSize: '1.1rem', color: 'var(--dark-gray)', marginBottom: '30px', lineHeight: '1.6' }}>
                {(app.short_description || app.description) +
                  ' This application is part of Akagera Inc’s commitment to delivering impactful technology. It is built with the latest standards for performance and security, ensuring you get the best experience possible. For more details, see the features and installation steps below.'}
              </p>

              {/* Download Section */}
              <div style={{
                background: 'var(--light-gray)',
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: 'var(--primary-blue)', marginBottom: '15px', fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>Ready to Download?</h3>
              <p style={{ color: 'var(--dark-gray)', marginBottom: '20px' }}>
                {app.requires_license 
                  ? '⚠️ This app requires a valid license key to activate.'
                  : '✅ This is a free app. No license required!'}
              </p>
              
              {app.download_url ? (
                <a 
                  href={app.download_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-large"
                  style={{ width: '100%', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Download size={20} style={{ marginRight: '10px' }} />
                  Download APK
                </a>
              ) : (
                <button className="btn btn-primary btn-large" style={{ width: '100%', cursor: 'not-allowed', opacity: 0.6 }} disabled>
                  <Download size={20} style={{ marginRight: '10px' }} />
                  Download Not Available
                </button>
              )}

              {app.requires_license && (
                <Link to="/services" className="btn btn-secondary btn-large" style={{ width: '100%', marginTop: '10px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={20} style={{ marginRight: '10px' }} />
                  Get License
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section style={{ marginBottom: '50px' }}>
          <h2 style={{ color: 'var(--primary-blue)', marginBottom: '25px' }}>How It Works</h2>
          <div style={{
            background: 'var(--light-gray)',
            padding: '30px',
            borderRadius: '12px',
            lineHeight: '1.8'
          }}>
            {app.how_it_works}
          </div>
        </section>

        {/* Features */}
        {app.features && app.features.length > 0 && (
          <section style={{ marginBottom: '50px' }}>
            <h2 style={{ color: 'var(--primary-blue)', marginBottom: '25px' }}>Features</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {app.features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    background: 'var(--white)',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '2px solid var(--medium-gray)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}
                >
                  <Check size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Installation Steps */}
        {app.installation_steps && app.installation_steps.length > 0 && (
          <section style={{ marginBottom: '50px' }}>
            <h2 style={{ color: 'var(--primary-blue)', marginBottom: '25px' }}>Installation Steps</h2>
            <div style={{
              background: 'var(--white)',
              border: '2px solid var(--medium-gray)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              {app.installation_steps.map((step, index) => (
                <div
                  key={index}
                  style={{
                    padding: '25px',
                    borderBottom: index < app.installation_steps.length - 1 ? '2px solid var(--medium-gray)' : 'none',
                    display: 'flex',
                    gap: '20px'
                  }}
                >
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      background: 'var(--secondary-red)',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                      flexShrink: 0
                    }}
                  >
                    {step.step}
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--primary-blue)', marginBottom: '5px' }}>
                      {step.title}
                    </h4>
                    <p style={{ color: 'var(--dark-gray)' }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* License Info */}
        <section style={{
          background: ' #1a1a1a',
          color: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'white', marginBottom: '15px' }}>License Information</h2>
          {app.requires_license ? (
            <>
              <p style={{ marginBottom: '25px', fontSize: '1.1rem' }}>
                ⚠️ This app requires a valid license key to use all features.
              </p>
              <Link to="/services" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
                <Lock size={20} style={{ marginRight: '10px' }} />
                Purchase License
              </Link>
            </>
          ) : (
            <p style={{ fontSize: '1.1rem' }}>
              ✅ This is a free app. Download and enjoy!
            </p>
          )}
        </section>
      </div>
    </div>
      {showSnackbar && error && <Snackbar message={error} onClose={() => setShowSnackbar(false)} />}
    </>
)
}

export default AppDetails;

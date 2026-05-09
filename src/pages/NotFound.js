import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--light-gray)'
    }}>
      <div className="container">
        <div style={{
          textAlign: 'center',
          background: 'var(--white)',
          padding: '60px 40px',
          borderRadius: '12px',
          boxShadow: 'var(--box-shadow)',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '5rem',
            color: 'var(--secondary-red)',
            marginBottom: '20px'
          }}>
            404
          </h1>
          <h2 style={{
            color: 'var(--primary-blue)',
            marginBottom: '15px'
          }}>
            Page Not Found
          </h2>
          <p style={{
            color: 'var(--dark-gray)',
            marginBottom: '30px',
            fontSize: '1.1rem'
          }}>
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          <button
            className="btn btn-primary btn-large"
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => navigate('/')}>Home</button>
            <button className="btn btn-outline" onClick={() => navigate('/apps')}>Apps</button>
            <button className="btn btn-outline" onClick={() => navigate('/services')}>Services</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

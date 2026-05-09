import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Phone, CheckCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './Payment.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51TUA0OIioeHjKlEEFZlAW7JqDx5dJ2nbHbu1mSnlSXV8qmp53ilmp6ILDD3nnVR0mJ46Ejyw6C6GgdOyrijki8Zn00Uw8flgB3');

function PaymentForm({ user, service, showToast }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [licenseKey, setLicenseKey] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Create payment intent on backend
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/payments/create-intent`,
        {
          amount: Number(service.price),
          service_id: service.id,
          currency: "usd"
        },
        { params: { user_id: user.id } }
      );
      const clientSecret = data.client_secret;

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });
      if (!stripe || !elements) {
        setError("Stripe is not ready yet. Please try again.");
        setLoading(false);
        return;
      }

      if (result.error) {
        setError(result.error.message);
        showToast(result.error.message, 'error');
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        // 3. Fetch license info from backend
        const licenseRes = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/licenses/generate`,
          null,
          { params: { user_id: user.id, service_id: service.id } }
        );
        setLicenseKey(licenseRes.data.license_key);
        setPaymentSuccess(true);
        showToast('Payment successful! License generated.', 'success');
      }
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Payment failed');
      showToast(err?.response?.data?.detail || err.message || 'Payment failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="payment-success" data-aos="zoom-in">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <CheckCircle size={80} style={{ color: 'var(--success)', marginBottom: '20px' }} />
          <h1 style={{ color: 'var(--primary-blue)', marginBottom: '10px' }}>
            Payment Successful!
          </h1>
          <p style={{ color: 'var(--dark-gray)', fontSize: '1.1rem' }}>
            Your license key (valid for 1 month):
          </p>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-blue)', margin: '20px 0' }}>{licenseKey}</div>
          <p style={{ color: 'var(--dark-gray)', fontSize: '1rem' }}>Please save this license key securely. It will expire in 1 month.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" value={user.name} disabled />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" value={user.email} disabled />
      </div>
      <div className="form-group">
        <label>Card Details</label>
        <div style={{ padding: 12, border: '1px solid #ccc', borderRadius: 8, background: '#fff' }}>
          <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
        </div>
      </div>
      <button type="submit" className="btn btn-primary btn-large" disabled={loading || !stripe || !elements} style={{ width: '100%' }}>
        {loading ? 'Processing...' : `Pay $${parseFloat(service.price).toFixed(2)}`}
      </button>
      {error && <div style={{ color: '#ff6b6b', marginTop: 16, fontWeight: 600 }}>{error}</div>}
      <div style={{ marginTop: 20, fontSize: '0.95rem', color: 'var(--dark-gray)', background: '#e3f2fd', padding: 12, borderRadius: 8 }}>
        <strong>🔒 Your card information is protected and never stored. Only the allowed amount will be charged.</strong>
      </div>
    </form>
  );
}

function Payment({ user, showToast }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [service, setService] = useState(null);

  useEffect(() => {
    const serviceData = location.state?.service;
    if (!serviceData) {
      navigate('/services');
      return;
    }
    setService(serviceData);
  }, [location, navigate]);

  if (!user) {
    return (
      <div className="payment-container" style={{ marginTop: '90px' }}>
        <div className="container">
          <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }} data-aos="zoom-in">
            <h1 style={{ color: 'var(--primary-blue)' }}>Please Login</h1>
            <p style={{ marginBottom: '20px' }}>You need to be logged in to make a payment.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="payment-container" style={{ marginTop: '90px' }}>
      <div className="container">
        <div style={{ maxWidth: '650px', margin: '0 auto' }} data-aos="zoom-in">
          {/* How to Pay Section */}
          <div style={{
            background: 'var(--light-gray)',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{ color: 'var(--primary-blue)', marginBottom: 18 }}>How to Pay for Our Services</h2>
            <ol style={{ paddingLeft: 18, marginBottom: 18 }}>
              <li style={{ marginBottom: 16 }}>
                <strong>Option 1: Pay with Card (Recommended)</strong>
                <ul style={{ marginTop: 8, fontSize: '0.98rem', color: 'var(--dark-gray)' }}>
                  <li>• Enter your card details securely on our payment form.</li>
                  <li>• Your card information is encrypted and never stored on our servers.</li>
                  <li>• Only the exact amount for the service will be charged.</li>
                  <li>• After successful payment, you will instantly receive a license key valid for 1 month.</li>
                  <li>• <span style={{ color: '#1976d2' }}>We use Stripe for secure payments. Your data is protected by industry-leading security.</span></li>
                </ul>
              </li>
              <li>
                <strong>Option 2: Pay with MoMo Virtual Card (Mobile Money)</strong>
                <ul style={{ marginTop: 8, fontSize: '0.98rem', color: 'var(--dark-gray)' }}>
                  <li>• Open your Mobile Money app and select "Virtual Card" or "MoMo Card" option.</li>
                  <li>• Generate a virtual card and use its details in the card payment form.</li>
                  <li>• Complete the payment as you would with a normal card.</li>
                  <li>• You will receive a license key after payment, just like with a regular card.</li>
                  <li>• <span style={{ color: '#1976d2' }}>MoMo virtual cards are safe and accepted for online payments. Make sure your card is enabled for online use.</span></li>
                </ul>
              </li>
            </ol>
            <div style={{ fontSize: '0.93rem', color: '#666', background: '#e3f2fd', padding: 12, borderRadius: 8 }}>
              <strong>Need help?</strong> Contact us at <a href="mailto:info@akagerinc.com" style={{ color: '#1976d2' }}>info@akagerinc.com</a> or <a href="tel:+1234567890" style={{ color: '#1976d2' }}>+1 (234) 567-890</a>.
            </div>
          </div>

          {/* Payment Form Section */}
          <div className="payment-card">
            <div style={{ marginBottom: '25px', padding: '20px', background: 'var(--light-gray)', borderRadius: '8px' }}>
              <h3 style={{ color: 'var(--primary-blue)', marginBottom: '10px' }}>{service.name}</h3>
              <p style={{ color: 'var(--dark-gray)', marginBottom: '15px' }}>{service.description}</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                Price: ${parseFloat(service.price).toFixed(2)}
              </p>
            </div>
            <Elements stripe={stripePromise}>
              <PaymentForm user={user} service={service} showToast={showToast} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
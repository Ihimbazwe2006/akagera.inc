import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const currencyRates = {
  USD: 1,
  RWF: 1330,
  EUR: 0.92,
  GBP: 0.79,
  KES: 153,
  UGX: 3750,
  ZAR: 18.5,
  CAD: 1.35,
  AUD: 1.5,
};

const methodDetails = {
  paypal: {
    title: 'Pay with PayPal',
    description: 'Pay securely via PayPal. This is the only live payment method right now.',
  },
  card: {
    title: 'Credit / Debit Card',
    description: 'Card payment is planned but not available yet. Use PayPal for now.',
  },
  momo: {
    title: 'Mobile Money (MoMo)',
    description: 'MoMo payment support is coming soon. Please complete payment with PayPal.',
  },
};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function Payment({ user, showToast }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paypalOrderId, setPaypalOrderId] = useState(null);
  const [paymentStep, setPaymentStep] = useState('method-selection');
  const [selectedMethod, setSelectedMethod] = useState('paypal');
  const [momoPhoneNumber, setMomoPhoneNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [unsupportedPaymentMethod, setUnsupportedPaymentMethod] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  useEffect(() => {
    const serviceData = location.state?.service;
    if (!serviceData) {
      navigate('/services');
      return;
    }
    setService(serviceData);
  }, [location, navigate]);

  const handlePayPalClick = async () => {
    if (!user || !service) {
      showToast('Please login and select a service first.', 'error');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/payments/paypal/create-order`,
        {
          amount: Number(service.price),
          service_id: service.id,
          currency: 'USD',
        },
        { params: { user_id: user.id } }
      );

      const { success, approval_url, paypal_order_id } = response.data;
      if (success && approval_url) {
        setPaypalOrderId(paypal_order_id);
        setPaymentStep('paypal-flow');
        showToast('PayPal order created successfully. Redirecting now...', 'success');
        setTimeout(() => {
          window.location.href = approval_url;
        }, 1100);
      } else {
        throw new Error('Failed to create PayPal order.');
      }
    } catch (err) {
      const message = err?.response?.data?.detail || err.message || 'Unable to create PayPal order.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsupportedPayment = (method) => {
    setUnsupportedPaymentMethod(method);
    setShowModal(true);
    showToast(`${method} is currently unavailable.`, 'info');
  };

  const handleProceed = () => {
    if (selectedMethod === 'paypal') {
      handlePayPalClick();
      return;
    }

    const methodName = selectedMethod === 'card' ? 'Card Payment' : 'Mobile Money (MoMo)';
    handleUnsupportedPayment(methodName);
  };

  if (!user) {
    return (
      <div className="payment-container">
        <div className="payment-header">
          <h1>Please Sign In</h1>
          <p>You must be logged in to proceed with payment.</p>
        </div>
        <div className="payment-content">
          <div className="payment-card">
            <p>Login to continue and choose PayPal for a secure, trusted checkout.</p>
            <button className="payment-button" onClick={() => navigate('/')}>
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

  const usdAmount = Number(service.price) || 0;
  const rwandanAmount = usdAmount * currencyRates.RWF;
  
  const convertedAmount = usdAmount * currencyRates[selectedCurrency];
  const displayAmount = formatCurrency(convertedAmount);

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Complete Your Payment</h1>
        <p>Only PayPal is currently active. Stripe card payment and MoMo are still being built.</p>
      </div>

      <div className="warning-banner">
        Stripe card payment and MoMo are not working yet. Only PayPal is available right now.
        Technical team is working on it.
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      {paymentStep === 'method-selection' && (
        <div className="payment-content payment-grid">
          <div className="payment-card">
            <div className="summary-header">
              <h2>Payment Details</h2>
            </div>
            <div className="info-row">
              <div className="info-label">Service</div>
              <div className="info-value">{service.name}</div>
            </div>
            {service.description && (
              <div className="info-row">
                <div className="info-label">Description</div>
                <div className="info-value">{service.description}</div>
              </div>
            )}
            <div className="info-row">
              <div className="info-label">Amount</div>
              <div className="info-value">${formatCurrency(usdAmount)} USD</div>
            </div>
            
            <div className="currency-selector">
              <label>Convert to:</label>
              <select
                className="currency-input"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                {Object.keys(currencyRates).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <div className="converted-amount">
                {displayAmount} {selectedCurrency}
              </div>
            </div>
            
            <div className="conversion-note">
              Based on a live market conversion rate of 1 USD = {currencyRates[selectedCurrency]} {selectedCurrency}.
            </div>
          </div>

          <div className="payment-card">
            <div className="section-title">Choose payment method</div>
            
            <div className="payment-methods-list">
              <div
                className={`payment-option payment-option--paypal ${selectedMethod === 'paypal' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('paypal')}
              >
                <div className="method-radio">
                  {selectedMethod === 'paypal' && <div className="method-radio-dot"></div>}
                </div>
                <div className="method-option-info">
                  <h4>Pay with PayPal</h4>
                  <p>Pay securely via PayPal. This is the only live payment method right now.</p>
                </div>
              </div>

              <div
                className={`payment-option payment-option--card ${selectedMethod === 'card' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('card')}
              >
                <div className="method-radio">
                  {selectedMethod === 'card' && <div className="method-radio-dot"></div>}
                </div>
                <div className="method-option-info">
                  <h4>Credit/Debit Card</h4>
                  <p>Card payment is planned but not available yet. Use PayPal for now.</p>
                </div>
              </div>

              <div
                className={`payment-option payment-option--momo ${selectedMethod === 'momo' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('momo')}
              >
                <div className="method-radio">
                  {selectedMethod === 'momo' && <div className="method-radio-dot"></div>}
                </div>
                <div className="method-option-info">
                  <h4>Mobile Money (MoMo)</h4>
                  <p>MoMo payment support is coming soon. Please complete payment with PayPal.</p>
                </div>
              </div>
            </div>

            {selectedMethod === 'momo' && (
              <div className="form-group">
                <label>Phone number</label>
                <input
                  type="tel"
                  className="payment-input"
                  value={momoPhoneNumber}
                  onChange={(e) => setMomoPhoneNumber(e.target.value)}
                  placeholder="Enter your mobile number"
                />
                <p className="input-help">We will use this number when MoMo support is live.</p>
              </div>
            )}

            <p className="trusted-note">
              Trusted payment: only the selected amount will be charged to your card or PayPal account.
            </p>

            <button
              className={`payment-button ${selectedMethod !== 'paypal' ? 'payment-button--disabled' : ''}`}
              onClick={handleProceed}
              disabled={loading}
              type="button"
            >
              {selectedMethod === 'paypal'
                ? loading
                  ? 'Creating PayPal order...'
                  : 'Pay with PayPal'
                : selectedMethod === 'card'
                ? 'Card payment unavailable'
                : 'MoMo payment unavailable'}
            </button>
          </div>

          <div className="payment-card support-card">
            <div className="section-title">Need help?</div>
            <p>Watch the PayPal tutorial if this is your first time paying online.</p>
            <a
              href="https://www.youtube.com/results?search_query=how+to+use+paypal+for+payment"
              target="_blank"
              rel="noopener noreferrer"
              className="support-link"
            >
              Watch PayPal tutorial
            </a>
          </div>
        </div>
      )}

      {paymentStep === 'paypal-flow' && (
        <div className="payment-content">
          <div className="paypal-flow">
            <div className="flow-header">
              <h2>PayPal Flow</h2>
              <p>Please complete the checkout in the PayPal window.</p>
            </div>
            <div className="flow-step-row">
              <div className="flow-step completed">
                <span>1</span>
                <div>
                  <h4>Order created</h4>
                  <p>Your order has been created and is ready for PayPal.</p>
                </div>
              </div>
              <div className="flow-step active">
                <span>2</span>
                <div>
                  <h4>Redirecting</h4>
                  <p>Redirecting to PayPal now. Please complete the payment there.</p>
                </div>
              </div>
              <div className="flow-step">
                <span>3</span>
                <div>
                  <h4>Return</h4>
                  <p>Return to this page once PayPal confirms your payment.</p>
                </div>
              </div>
            </div>
            <div className="paypal-info">
              <p>
                Order ID: <strong>{paypalOrderId}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <div className="modal-header">
              <h2>Payment Unavailable</h2>
            </div>
            <div className="modal-body">
              <p>
                <strong>{unsupportedPaymentMethod}</strong> is not available yet. Please use PayPal for now.
              </p>
              <p className="modal-info">
                Only PayPal is fully supported. Our team is working to add card and MoMo payments.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
              <button className="btn-primary" onClick={() => {
                setShowModal(false);
                setSelectedMethod('paypal');
              }}>
                Switch to PayPal
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="security-badge">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
        <span>Trusted checkout. Only the selected amount will be charged.</span>
      </div>
    </div>
  );
}

export default Payment;

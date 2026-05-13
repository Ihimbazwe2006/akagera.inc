import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

const API = process.env.REACT_APP_API_URL || 'http://akagerainc.onrender.com/api';

const currencyRates = {
  USD: 1,
  RWF: 1460,
  EUR: 0.85,
  GBP: 0.79,
  KES: 153,
  UGX: 3750,
  ZAR: 18.5,
  CAD: 1.35,
  AUD: 1.5,
};

const methodDetails = {
  paypal: {
    title: 'Card payment with PayPal',
    description: 'Pay securely via PayPal using cards Visa, Mastercard, and American Express.',
  },
  momo: {
    title: 'Mobile Money (MoMo)',
    description: 'Pay with MTN, Airtel, or other mobile money wallets.',
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
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  useEffect(() => {
    const serviceData = location.state?.service;
    if (!serviceData) {
      navigate('/services');
      return;
    }
    setService(serviceData);
  }, [location, navigate]);

  // Helper function to extract error message from various error formats
  const getErrorMessage = (err) => {
    if (err?.response?.data?.detail) {
      const detail = err.response.data.detail;
      if (Array.isArray(detail) && detail.length > 0) {
        return detail.map(d => d.msg || d.message || JSON.stringify(d)).join(', ');
      }
      if (typeof detail === 'string') {
        return detail;
      }
      if (typeof detail === 'object') {
        return detail.msg || detail.message || 'An error occurred';
      }
    }
    return err?.message || 'An unexpected error occurred';
  };

  // --- Payment Handlers ---
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
      const message = getErrorMessage(err);
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMoMoPayment = async () => {
    if (!user || !service) {
      showToast('Please login and select a service first.', 'error');
      return;
    }
    if (!momoPhoneNumber) {
      setError('Please enter your mobile number for MoMo payment.');
      showToast('Please enter your mobile number.', 'error');
      return;
    }
    
    const phoneRegex = /^07[2-9][0-9]{7}$/;
    if (!phoneRegex.test(momoPhoneNumber)) {
      setError('Please enter a valid Rwandan phone number (e.g., 078XXXXXXX)');
      showToast('Invalid phone number format', 'error');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const requestData = {
        amount: Number(service.price),
        service_id: service.id,
        currency: 'USD',
        user_id: user.id,
        phone_number: momoPhoneNumber
      };
      
      const response = await axios.post(
        `${API}/payments/initiate-momo`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      const { success, momo_reference, error } = response.data;
      
      if (success && momo_reference) {
        setPaymentStep('momo-flow');
        showToast('MoMo payment initiated. Please approve on your phone.', 'success');
      } else {
        let userFriendlyError = '';
        
        if (error) {
          if (error.toLowerCase().includes('balance') || 
              error.toLowerCase().includes('insufficient') ||
              error.toLowerCase().includes('failed check users balance')) {
            userFriendlyError = '❌ Insufficient Balance: Your mobile money account does not have enough funds to complete this payment. Please check your balance and try again.';
            showToast('Insufficient balance. Please add funds to your mobile money account.', 'error');
          } 
          else if (error.toLowerCase().includes('invalid') && error.toLowerCase().includes('phone')) {
            userFriendlyError = '❌ Invalid Phone Number: Please enter a valid mobile money number.';
            showToast('Invalid phone number. Please check and try again.', 'error');
          }
          else if (error.toLowerCase().includes('network')) {
            userFriendlyError = '❌ Network Error: Unable to process payment. Please check your connection and try again.';
            showToast('Network error. Please try again.', 'error');
          }
          else {
            userFriendlyError = `❌ Payment Failed: ${error}`;
            showToast(error, 'error');
          }
        } else {
          userFriendlyError = '❌ Payment Failed: Unable to initiate payment. Please try again.';
          showToast('Payment failed. Please try again.', 'error');
        }
        
        setError(userFriendlyError);
      }
    } catch (err) {
      console.error('MoMo payment error:', err);
      
      let errorMessage = '';
      
      if (err.response?.data?.error) {
        const apiError = err.response.data.error;
        if (apiError.toLowerCase().includes('balance') || apiError.toLowerCase().includes('insufficient')) {
          errorMessage = '❌ Insufficient Balance: Your mobile money account does not have enough funds. Please add funds and try again.';
        } else {
          errorMessage = `❌ Payment Failed: ${apiError}`;
        }
      } 
      else if (err.response?.data?.detail) {
        errorMessage = `❌ Error: ${err.response.data.detail}`;
      }
      else if (err.message === 'Network Error') {
        errorMessage = '❌ Network Error: Please check your internet connection and try again.';
      }
      else {
        errorMessage = '❌ Payment Failed: An unexpected error occurred. Please try again later.';
      }
      
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (selectedMethod === 'paypal') {
      handlePayPalClick();
    } else if (selectedMethod === 'momo') {
      handleMoMoPayment();
    }
  };

  // --- UI Rendering ---
  if (!user) {
    return (
      <div className="payment-container">
        <div className="payment-header">
          <h1>Please Sign In</h1>
          <p>You must be logged in to proceed with payment.</p>
        </div>
        <div className="payment-content">
          <div className="payment-card">
            <p>Login to continue and choose PayPal or Mobile Money for a secure, trusted checkout.</p>
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
        <p>Choose your preferred payment method below. Mobile Money and PayPal are supported.</p>
      </div>

      {error && (
        <div className={`alert alert-error ${error.includes('Insufficient Balance') ? 'alert-insufficient-funds' : ''}`}>
          <div className="alert-content">
            <span className="alert-icon">⚠️</span>
            <div className="alert-message">
              <strong>{error.includes('Insufficient Balance') ? 'Payment Failed!' : 'Error!'}</strong>
              <p>{error}</p>
            </div>
          </div>
          {error.includes('Insufficient Balance') && (
            <div className="alert-suggestions">
              <p><strong>Suggestions:</strong></p>
              <ul>
                <li>💵 Check your mobile money balance</li>
                <li>💰 Add funds to your mobile money account</li>
                <li>🔄 Try a smaller amount</li>
                <li>💳 Use PayPal instead</li>
              </ul>
            </div>
          )}
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
              <div className="info-value">{formatCurrency(usdAmount)} USD</div>
            </div>
            <div className="info-row">
              <div className="info-label">Amount (RWF)</div>
              <div className="info-value">{formatCurrency(rwandanAmount)} RWF</div>
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
                className={`payment-option payment-option--momo ${selectedMethod === 'momo' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('momo')}
              >
                <div className="method-radio">
                  {selectedMethod === 'momo' && <div className="method-radio-dot"></div>}
                </div>
                <div className="method-option-info">
                  <h4>Mobile Money (MoMo)</h4>
                  <p>Pay with MTN, Airtel, or other mobile money wallets.</p>
                </div>
              </div>

              <div
                className={`payment-option payment-option--paypal ${selectedMethod === 'paypal' ? 'active' : ''}`}
                onClick={() => setSelectedMethod('paypal')}
              >
                <div className="method-radio">
                  {selectedMethod === 'paypal' && <div className="method-radio-dot"></div>}
                </div>
                <div className="method-option-info">
                  <h4>Card payment with PayPal</h4>
                  <p>Pay securely via PayPal. use cards visa, mastercard, and american express. International cards and balances supported.</p>
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
                <p className="input-help">Enter your mobile number to receive a MoMo payment prompt.</p>
              </div>
            )}

            <p className="trusted-note">
              Trusted payment: only the selected amount will be charged to your phone or PayPal account. Your personal information is private and never saved.
            </p>

            <button
              className={`payment-button`}
              onClick={handleProceed}
              disabled={loading}
              type="button"
            >
              {selectedMethod === 'paypal'
                ? loading
                  ? 'Creating PayPal order...'
                  : 'Pay with PayPal'
                : selectedMethod === 'momo'
                ? loading
                  ? 'Initiating MoMo payment...'
                  : 'Pay with MoMo'
                : 'Pay'}
            </button>
          </div>
        </div>
      )}

      {paymentStep === 'momo-flow' && (
        <div className="payment-content">
          <div className="momo-flow">
            <div className="flow-header">
              <h2>MoMo Payment</h2>
              <p>A prompt has been sent to your mobile phone. Approve the payment to complete.</p>
            </div>
            <div className="flow-step-row">
              <div className="flow-step completed">
                <span>1</span>
                <div>
                  <h4>Order created</h4>
                  <p>Your order is ready for MoMo payment.</p>
                </div>
              </div>
              <div className="flow-step active">
                <span>2</span>
                <div>
                  <h4>Approve on phone</h4>
                  <p>Check your phone and approve the MoMo payment prompt.</p>
                </div>
              </div>
              <div className="flow-step">
                <span>3</span>
                <div>
                  <h4>Return</h4>
                  <p>Return to this page once payment is confirmed.</p>
                </div>
              </div>
            </div>
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
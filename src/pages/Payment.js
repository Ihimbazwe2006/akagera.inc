import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './Payment.css';

// Stripe init
const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);

function PaymentForm({ user, service, showToast }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [licenseKey, setLicenseKey] = useState(null);

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  // 1. Create PaymentIntent ONCE when page loads
  useEffect(() => {
    const createIntent = async () => {
      try {
        const res = await axios.post(
          `${API}/payments/create-intent`,
          {
            amount: Number(service.price),
            service_id: service.id,
            currency: "usd"
          },
          { params: { user_id: user.id } }
        );

        setClientSecret(res.data.client_secret);
        setPaymentIntentId(res.data.payment_intent_id);
      } catch (err) {
        console.error(err);
        setError("Failed to initialize payment.");
      }
    };

    if (user && service) {
      createIntent();
    }
  }, [user, service]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe not ready");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement || !cardComplete) {
      setError("Enter valid card details");
      setLoading(false);
      return;
    }

    if (!clientSecret) {
      setError("Payment not initialized");
      setLoading(false);
      return;
    }

    try {
      // 2. Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.name,
            email: user.email
          }
        }
      });

      if (result.error) {
        setError(result.error.message);
        showToast(result.error.message, "error");
        setLoading(false);
        return;
      }

      const paymentIntent = result.paymentIntent;

      // 3. Handle success
      if (paymentIntent.status === "succeeded") {

        // OPTIONAL: only if backend doesn't use webhook properly
        try {
          const licenseRes = await axios.post(
            `${API}/licenses/generate`,
            null,
            {
              params: {
                user_id: user.id,
                service_id: service.id
              }
            }
          );

          setLicenseKey(licenseRes.data.license_key);
        } catch (err) {
          console.warn("License generation skipped (prefer webhook)");
        }

        setPaymentSuccess(true);
        showToast("Payment successful!", "success");
      } else {
        setError(`Payment status: ${paymentIntent.status}`);
      }

    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <CheckCircle size={70} color="green" />
        <h2>Payment Successful</h2>

        {licenseKey && (
          <>
            <p>Your License Key:</p>
            <h3>{licenseKey}</h3>
          </>
        )}

        <p>Please save this key safely.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={user.name} disabled />
      <input value={user.email} disabled />

      <div style={{ padding: 12, border: "1px solid #ccc" }}>
        <CardElement
          onChange={(e) => setCardComplete(e.complete)}
        />
      </div>

      <button disabled={loading || !stripe || !clientSecret}>
        {loading ? "Processing..." : `Pay $${service.price}`}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default function Payment({ user, showToast }) {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service;

  useEffect(() => {
    if (!service) navigate("/services");
  }, [service]);

  if (!user) {
    return (
      <div>
        <h2>Please login first</h2>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    );
  }

  if (!service) return null;

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm user={user} service={service} showToast={showToast} />
    </Elements>
  );
}


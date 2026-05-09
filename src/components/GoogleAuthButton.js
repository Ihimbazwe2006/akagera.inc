import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import '../index.css';

function GoogleAuthButton({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const user = result.user;
      const token = await user.getIdToken();

      // Send token to backend for verification
      const response = await fetch("http://localhost:8000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          name: user.displayName,
          email: user.email,
          profile_picture: user.photoURL,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        if (onLogin) {
          onLogin(data.user);
        }

        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        setError(data.detail || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError("Failed to login with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-auth-button">
      <button
        onClick={handleGoogleAuth}
        disabled={loading}
        className="btn btn-primary btn-large"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        {loading ? (
          <>
            <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
            Signing in...
          </>
        ) : (
          <>
            <i className="fab fa-google" style={{ fontSize: '20px' }}></i>
            Sign in with Google
          </>
        )}
      </button>
      {error && <p className="error-message" style={{ color: "#000", fontSize: "0.9rem", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default GoogleAuthButton;

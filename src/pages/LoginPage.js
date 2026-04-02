import React from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User Logged In:", result.user);
      // After login, send user to Home page
      navigate('/');
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("Login failed! Check your Firebase settings.");
    }
  };

  return (
    <div style={loginContainer}>
      <h1>Welcome to FreshShop 🛒</h1>
      <p>Please login to start shopping</p>
      <button onClick={handleGoogleLogin} style={googleBtn}>
        Sign in with Google 🌐
      </button>
    </div>
  );
};

// Styles
const loginContainer = { 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center', 
  height: '70vh' 
};

const googleBtn = {
  padding: '12px 24px',
  fontSize: '16px',
  cursor: 'pointer',
  background: '#4285F4',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold'
};

export default LoginPage;
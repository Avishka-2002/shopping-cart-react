import React, { useState, useEffect } from 'react';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// ... other imports (Navbar, ProductCard, CartPage, etc.)

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // This "Listener" detects if a user logs in or out
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => signOut(auth);

  return (
    <Router>
      <Navbar user={user} logout={handleLogout} />
      <Routes>
        {/* If not logged in, force them to Login Page */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
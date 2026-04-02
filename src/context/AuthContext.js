import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, facebookProvider, isFirebaseAvailable } from '../services/firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { createUserProfile, getUserProfile } from '../services/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsAdmin(user.email === 'admin@freshshop.com' || user.email?.includes('admin'));

        if (isFirebaseAvailable) {
          try {
            const existingProfile = await getUserProfile(user.uid);
            if (!existingProfile) {
              await createUserProfile(user.uid, {
                email: user.email || '',
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                createdAt: new Date(),
              });
            }
          } catch (err) {
            console.error('Error ensuring user profile in Firestore:', err);
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      const err = new Error('Firebase auth is not initialized. Check Firebase config in .env');
      console.error('Google sign in error:', err);
      throw err;
    }

    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    if (!auth) {
      const err = new Error('Firebase auth is not initialized. Check Firebase config in .env');
      console.error('Facebook sign in error:', err);
      throw err;
    }

    try {
      setLoading(true);
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      console.error('Facebook sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email, password) => {
    if (!auth) {
      const err = new Error('Firebase auth is not initialized. Check Firebase config in .env');
      console.error('Email sign up error:', err);
      throw err;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const createdUser = userCredential.user;

      if (createdUser && isFirebaseAvailable) {
        await createUserProfile(createdUser.uid, {
          email: createdUser.email || '',
          displayName: createdUser.displayName || '',
          photoURL: createdUser.photoURL || '',
          createdAt: new Date(),
        });
      }

      return userCredential;
    } catch (error) {
      console.error('Email sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
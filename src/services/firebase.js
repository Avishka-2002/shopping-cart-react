import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  setPersistence, 
  browserLocalPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * 1. Configuration object
 * These values are pulled from your .env file for security.
 * Ensure your .env file contains keys starting with REACT_APP_
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// 2. Variables for Firebase services
let app;
let auth;
let db;
let storage;
let isFirebaseAvailable = false;

// 3. Authentication Providers Setup
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Professional Touch: Force Google to ask which account to use
googleProvider.setCustomParameters({ prompt: 'select_account' });

// 4. Guard: Check if API Key exists before initializing
const isValidConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";

if (isValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // browserLocalPersistence: Keeps user logged in even after closing the tab
    setPersistence(auth, browserLocalPersistence);
    
    isFirebaseAvailable = true;
    console.info('✅ FreshShop Firebase initialized successfully.');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
  }
} else {
  console.warn('⚠️ Firebase API Key missing. Authentication & Firestore are disabled.');
}

// 5. Export everything for use in your Login and Admin pages
export { auth, googleProvider, facebookProvider, db, storage, isFirebaseAvailable };
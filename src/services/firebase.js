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

// 1. Configuration using Environment Variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// 2. Validation Check
const isValidConfig = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('your_');

let app;
let auth;
let db;
let storage;
let isFirebaseAvailable = false;

// 3. Providers Setup
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Customizing Providers (Optional but professional)
googleProvider.setCustomParameters({ prompt: 'select_account' });

// 4. Initialization Logic
if (isValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Set Persistence: Keeps the user logged in even after closing the tab 
    setPersistence(auth, browserLocalPersistence);
    
    isFirebaseAvailable = true;
    console.info('✅ Firebase initialized successfully.');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
  }
} else {
  console.warn('⚠️ Firebase config missing. Authentication and Database features will be disabled.');
}

export { auth, googleProvider, facebookProvider, db, storage, isFirebaseAvailable };
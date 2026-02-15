// ===============================
// Firebase Configuration
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔹 Replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCwOTEzdfthW8mvmXLoiRQ5pvDx8VOAQCM",
  authDomain: "sc-coaching-3739d.firebaseapp.com",
  projectId: "sc-coaching-3739d",
  storageBucket: "sc-coaching-3739d.firebasestorage.app",
  messagingSenderId: "930192153759",
  appId: "1:930192153759:web:a9e2d53b7941ec801156aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
const db = getFirestore(app);

// Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export for other modules
export { db, auth, provider };

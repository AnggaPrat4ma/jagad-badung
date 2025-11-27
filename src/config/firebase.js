// src/config/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Firebase Configuration
// TODO: Ganti dengan konfigurasi Firebase project Anda
const firebaseConfig = {
  apiKey: "AIzaSyDR0_EJ-xceZeGY8YUb9ewqXbo-lYQspHQ",
  authDomain: "pengelolaevent-bb1b3.firebaseapp.com",
  projectId: "pengelolaevent-bb1b3",
  storageBucket: "pengelolaevent-bb1b3.firebasestorage.app",
  messagingSenderId: "341419718777",
  appId: "1:341419718777:web:f7c37c7cbdcaaf7d23fca8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
const auth = getAuth(app)
const provider = new GoogleAuthProvider();

export { app, auth, provider }
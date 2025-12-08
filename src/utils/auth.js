// src/utils/auth.js
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../config/firebase";
import axios from 'axios';

const auth = getAuth(app);

// ✅ API Base URL - hardcoded or from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://172.18.210.102:8000/api';

/**
 * 🔑 Get JWT Token from localStorage
 */
export function getJwtToken() {
  return localStorage.getItem('jwtToken');
}

/**
 * 💾 Save JWT Token to localStorage
 */
export function saveJwtToken(token) {
  localStorage.setItem('jwtToken', token);
  console.log('✅ JWT token saved');
}

/**
 * 🗑️ Remove JWT Token from localStorage
 */
export function removeJwtToken() {
  localStorage.removeItem('jwtToken');
  console.log('✅ JWT token removed');
}

/**
 * ✅ Verify JWT Token with backend
 */
export async function verifyJwtToken() {
  try {
    const token = getJwtToken();
    
    if (!token) {
      console.log('ℹ️ No JWT token found');
      return false;
    }

    const response = await axios.post(
      `${API_BASE_URL}/auth/verify-token`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      console.log('✅ JWT token is valid');
      return true;
    }

    console.log('❌ JWT token is invalid');
    return false;

  } catch (error) {
    console.error('❌ Error verifying JWT token:', error.response?.data || error.message);
    
    // Token invalid/expired - cleanup
    if (error.response?.status === 401) {
      removeJwtToken();
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
    
    return false;
  }
}

/**
 * 🔄 Refresh JWT Token
 */
export async function refreshJwtToken() {
  try {
    const token = getJwtToken();
    
    if (!token) {
      console.log('ℹ️ No token to refresh');
      return null;
    }

    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      const newToken = response.data.data.token;
      saveJwtToken(newToken);
      console.log('✅ JWT token refreshed');
      return newToken;
    }

    return null;

  } catch (error) {
    console.error('❌ Error refreshing JWT token:', error.response?.data || error.message);
    removeJwtToken();
    return null;
  }
}

/**
 * 👤 Get current user data from backend using JWT
 */
export async function getCurrentUserFromBackend() {
  try {
    const token = getJwtToken();
    
    if (!token) {
      console.log('ℹ️ No JWT token available');
      return null;
    }

    const response = await axios.get(
      `${API_BASE_URL}/auth/me`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      console.log('✅ User data fetched from backend');
      return response.data.data;
    }

    return null;

  } catch (error) {
    console.error('❌ Error fetching user data:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      removeJwtToken();
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
    
    return null;
  }
}

/**
 * ✅ Get current Firebase user (kept for backward compatibility)
 */
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}

/**
 * ✅ Get current user ID
 */
export async function getCurrentUserId() {
  // Try JWT first
  const token = getJwtToken();
  if (token) {
    const userData = await getCurrentUserFromBackend();
    return userData ? userData.id_user : null;
  }

  // Fallback to Firebase
  const user = await getCurrentUser();
  return user ? user.uid : null;
}

/**
 * 🚪 Logout (supports both JWT and Firebase)
 */
export async function logout() {
  try {
    const token = getJwtToken();

    // Logout from backend if JWT exists
    if (token) {
      try {
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ Backend logout successful');
      } catch (error) {
        console.error('⚠️ Backend logout error:', error.response?.data || error.message);
      }
    }

    // Clear JWT token
    removeJwtToken();

    // Logout from Firebase
    await signOut(auth);
    console.log('✅ Firebase signOut successful');

    // Clear all auth data
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('tokenExpiresAt');

  } catch (error) {
    console.error('❌ Logout error:', error);
    
    // Force clear even if error
    removeJwtToken();
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('tokenExpiresAt');
    
    throw error;
  }
}

/**
 * ✅ Get Firebase ID Token (kept for Firebase authentication flow)
 */
export const getFirebaseToken = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken(true);
      console.log('✅ Firebase token obtained');
      return token;
    }

    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (isAuthenticated) {
      console.log('⚠️ User data exists but no Firebase currentUser');
      console.log('⚠️ Waiting for Firebase auth state...');
      
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          async (user) => {
            unsubscribe();
            
            if (user) {
              try {
                const token = await user.getIdToken(true);
                console.log('✅ Token obtained after auth state change');
                resolve(token);
              } catch (error) {
                console.error('❌ Error getting token after auth state:', error);
                reject(error);
              }
            } else {
              console.log('❌ No Firebase user found');
              resolve(null);
            }
          },
          (error) => {
            console.error('❌ Auth state change error:', error);
            reject(error);
          }
        );
        
        setTimeout(() => {
          unsubscribe();
          console.log('⏱️ Auth state timeout');
          resolve(null);
        }, 3000);
      });
    }

    console.log('ℹ️ No Firebase user and not authenticated');
    return null;
  } catch (error) {
    console.error('❌ Error in getFirebaseToken:', error);
    return null;
  }
};

/**
 * ✅ Check if user session is valid (JWT-first approach)
 */
export const checkAuthSession = async () => {
  // Check JWT first
  const jwtToken = getJwtToken();
  if (jwtToken) {
    const isValid = await verifyJwtToken();
    
    console.log('🔍 JWT Auth session check:', {
      hasJwtToken: true,
      isValid
    });
    
    return isValid;
  }

  // Fallback to Firebase check
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const hasUser = localStorage.getItem('user') !== null;
  const hasFirebaseToken = localStorage.getItem('firebaseToken') !== null;
  
  const isValid = isAuthenticated && hasUser && hasFirebaseToken;
  
  console.log('🔍 Firebase Auth session check:', {
    isAuthenticated,
    hasUser,
    hasFirebaseToken,
    isValid
  });
  
  return isValid;
};

/**
 * 🔄 Force refresh Firebase token (kept for backward compatibility)
 */
export const refreshFirebaseToken = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const token = await user.getIdToken(true);
      localStorage.setItem('firebaseToken', token);
      console.log('✅ Firebase token refreshed and saved');
      return token;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error refreshing Firebase token:', error);
    return null;
  }
};

/**
 * 🔐 Check if user is authenticated (JWT or Firebase)
 */
export const isAuthenticated = () => {
  const jwtToken = getJwtToken();
  const firebaseAuth = localStorage.getItem('isAuthenticated') === 'true';
  
  return jwtToken !== null || firebaseAuth;
};

export { auth };
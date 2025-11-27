// src/utils/auth.js
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../config/firebase";

const auth = getAuth(app);

/**
 * ✅ Get current Firebase user
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
  const user = await getCurrentUser();
  return user ? user.uid : null;
}

/**
 * ✅ Logout from Firebase
 */
export async function logout() {
  try {
    await signOut(auth);
    console.log('✅ Firebase signOut successful')
  } catch (error) {
    console.error('❌ Firebase signOut error:', error)
    throw error
  }
}

/**
 * ✅ Get Firebase ID Token (with better error handling)
 */
export const getFirebaseToken = async () => {
  try {
    const auth = getAuth()
    const user = auth.currentUser

    if (user) {
      // Try to get fresh token
      const token = await user.getIdToken(true) // force refresh
      console.log('✅ Firebase token obtained')
      return token
    }

    // No current user - check if we should restore session
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    
    if (isAuthenticated) {
      console.log('⚠️ User data exists but no Firebase currentUser')
      console.log('⚠️ Waiting for Firebase auth state...')
      
      // Wait for Firebase auth state to initialize
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          async (user) => {
            unsubscribe()
            
            if (user) {
              try {
                const token = await user.getIdToken(true)
                console.log('✅ Token obtained after auth state change')
                resolve(token)
              } catch (error) {
                console.error('❌ Error getting token after auth state:', error)
                reject(error)
              }
            } else {
              console.log('❌ No Firebase user found')
              resolve(null)
            }
          },
          (error) => {
            console.error('❌ Auth state change error:', error)
            reject(error)
          }
        )
        
        // Timeout after 3 seconds
        setTimeout(() => {
          unsubscribe()
          console.log('⏱️ Auth state timeout')
          resolve(null)
        }, 3000)
      })
    }

    console.log('ℹ️ No Firebase user and not authenticated')
    return null
  } catch (error) {
    console.error('❌ Error in getFirebaseToken:', error)
    return null
  }
}

/**
 * ✅ Check if user session is valid
 */
export const checkAuthSession = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const hasUser = localStorage.getItem('user') !== null
  const hasToken = localStorage.getItem('firebaseToken') !== null
  
  const isValid = isAuthenticated && hasUser && hasToken
  
  console.log('🔍 Auth session check:', {
    isAuthenticated,
    hasUser,
    hasToken,
    isValid
  })
  
  return isValid
}

/**
 * ✅ Force refresh Firebase token
 */
export const refreshFirebaseToken = async () => {
  try {
    const auth = getAuth()
    const user = auth.currentUser
    
    if (user) {
      const token = await user.getIdToken(true) // force refresh
      localStorage.setItem('firebaseToken', token)
      console.log('✅ Token refreshed and saved')
      return token
    }
    
    return null
  } catch (error) {
    console.error('❌ Error refreshing token:', error)
    return null
  }
}

export { auth };
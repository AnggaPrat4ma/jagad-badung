import { createRouter, createWebHistory } from 'vue-router'
import HomeHero from '../components/HomeHero.vue'
import Login from '../pages/login.vue'
import Dashboard from '../pages/dashboard.vue'
import profile from '../pages/profile.vue'
import Events from '../pages/events.vue'
import Eventdetail from '../components/eventdetail.vue'
import Myticket from '../pages/myticket.vue'
import aboutus from '../pages/aboutus.vue'
import admin from '../pages/admin.vue'
import Eomanagement from '../pages/eomanagement.vue'
import JenisTiketManagement from '../components/jenisTiketManagement.vue'
import debugAuth from '../pages/debugAuth.vue'
import { getFirebaseToken } from '../utils/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeHero,
    meta: { requiresAuth: false, hideNavbar: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false, guestOnly: true, hideNavbar: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'profile',
    component: profile,
    meta: { hideNavbar: true, requiresAuth: false }
  },
  {
    path: '/events',
    name: 'events',
    component: Events,
    meta: { requiresAuth: false }
  },
  {
    path: '/events/:id',
    name: 'EventDetail',
    component: Eventdetail,
    meta: { hideNavbar: true, requiresAuth: false }
  },
  {
    path: '/myticket',
    name: 'myticket',
    component: Myticket,
    meta: { requiresAuth: true }
  },
  {
    path: '/aboutus',
    name: 'aboutus',
    component: aboutus,
    meta: { requiresAuth: false }
  },
  {
    path: '/debug-auth',
    name: 'debug-auth',
    component: debugAuth,
    meta: { requiresAuth: false }
  },
  {
    path: '/admin',
    name: 'admin',
    component: admin,
    meta: { requiresAuth: true, requiresRole: ['Admin'] }
  },
  {
    path: '/eo',
    name: 'eo',
    component: Eomanagement,
    meta: { requiresAuth: true, requiresRole: ['EO', 'Admin'] }
  },
  {
    path: '/eo/events/:eventId/tiket',
    name: 'JenisTiketManagement',
    component: JenisTiketManagement,
    meta: { requiresAuth: true, requiresRole: ['EO', 'Admin'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// ✅ Navigation Guard
router.beforeEach(async (to, from, next) => {
  console.log('🔹 Navigating to:', to.path)

  // Check if user is authenticated from localStorage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const hasUserData = localStorage.getItem('user') !== null
  const hasFirebaseToken = localStorage.getItem('firebaseToken') !== null
  
  console.log('🔐 Auth Check:', {
    isAuthenticated,
    hasUserData,
    hasFirebaseToken,
    path: to.path
  })

  // If route requires authentication
  if (to.meta.requiresAuth) {
    // ✅ Simple check: If data exists in localStorage, allow access
    if (!isAuthenticated || !hasUserData) {
      console.log('❌ Not authenticated (no data in localStorage), redirecting to login')
      
      // Clear potentially corrupted data
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user')
      localStorage.removeItem('roles')
      localStorage.removeItem('permissions')
      localStorage.removeItem('firebaseToken')
      
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }

    // ✅ Optional: Verify Firebase token is still valid
    // Only do this check occasionally, not on every navigation
    if (hasFirebaseToken) {
      try {
        const token = await getFirebaseToken()
        
        if (!token) {
          console.log('⚠️ Firebase token expired, but keeping session (will refresh on API call)')
          // Don't redirect here - let axios interceptor handle token refresh
        } else {
          console.log('✅ Firebase token is valid')
        }
      } catch (error) {
        console.log('⚠️ Error checking Firebase token:', error.message)
        // Don't block navigation, let axios handle it
      }
    }

    // Check role-based access
    if (to.meta.requiresRole) {
      const userRoles = JSON.parse(localStorage.getItem('roles') || '[]')
      const hasRequiredRole = to.meta.requiresRole.some(role => userRoles.includes(role))

      if (!hasRequiredRole) {
        console.log('❌ No required role, redirecting to dashboard')
        alert('You do not have permission to access this page')
        return next('/dashboard')
      }
    }

    console.log('✅ Auth check passed, proceeding to route')
  }

  // If route is guest only (like login page)
  if (to.meta.guestOnly && isAuthenticated && hasUserData) {
    console.log('✅ Already authenticated, redirecting to dashboard')
    return next('/dashboard')
  }

  // Proceed to route
  next()
})

export default router
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
import { getJwtToken, verifyJwtToken } from '../utils/auth'

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
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: profile,
    meta: { hideNavbar: true, requiresAuth: true }
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

// ✅ FIXED: Navigation Guard with JWT Token Check
router.beforeEach(async (to, from, next) => {
  console.log('🔹 Navigating to:', to.path)

  // ✅ Check JWT token first (priority)
  const jwtToken = getJwtToken()
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const userDataStr = localStorage.getItem('user')
  
  console.log('🔐 Auth Check:', {
    hasJwtToken: !!jwtToken,
    isAuthenticated,
    hasUserData: !!userDataStr,
    path: to.path
  })

  // If route requires authentication
  if (to.meta.requiresAuth) {
    // ✅ Check if JWT token exists
    if (!jwtToken || !isAuthenticated || !userDataStr) {
      console.log('❌ Not authenticated, redirecting to login')
      
      // Clear potentially corrupted data
      localStorage.removeItem('jwtToken')
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user')
      localStorage.removeItem('firebaseToken')
      
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }

    // ✅ Parse user data
    let userData
    try {
      userData = JSON.parse(userDataStr)
    } catch (error) {
      console.error('❌ Failed to parse user data:', error)
      localStorage.clear()
      return next('/login')
    }

    // ✅ Check role-based access
    if (to.meta.requiresRole) {
      // Get user roles from localStorage
      const userRoles = userData.roles || []
      
      console.log('🎭 Role Check:', {
        requiredRoles: to.meta.requiresRole,
        userRoles: userRoles,
        userData: userData
      })
      
      // Check if user has any of the required roles
      const hasRequiredRole = to.meta.requiresRole.some(role => 
        userRoles.includes(role)
      )

      if (!hasRequiredRole) {
        console.log('❌ No required role, redirecting to dashboard')
        console.log('Required:', to.meta.requiresRole)
        console.log('User has:', userRoles)
        
        alert(`You need one of these roles to access this page: ${to.meta.requiresRole.join(', ')}`)
        return next('/dashboard')
      }
      
      console.log('✅ Role check passed')
    }

    // ✅ Optional: Verify JWT token periodically (not on every navigation)
    // Only verify if last check was more than 5 minutes ago
    const lastTokenCheck = parseInt(localStorage.getItem('lastTokenCheck') || '0')
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000
    
    if (now - lastTokenCheck > fiveMinutes) {
      console.log('🔄 Verifying JWT token...')
      
      const isValid = await verifyJwtToken()
      
      if (!isValid) {
        console.log('❌ JWT token is invalid, redirecting to login')
        localStorage.clear()
        return next({
          path: '/login',
          query: { redirect: to.fullPath, reason: 'session_expired' }
        })
      }
      
      localStorage.setItem('lastTokenCheck', now.toString())
      console.log('✅ JWT token is valid')
    }

    console.log('✅ Auth check passed, proceeding to route')
  }

  // If route is guest only (like login page)
  if (to.meta.guestOnly && jwtToken && isAuthenticated) {
    console.log('✅ Already authenticated, redirecting to dashboard')
    return next('/dashboard')
  }

  // Proceed to route
  next()
})

export default router
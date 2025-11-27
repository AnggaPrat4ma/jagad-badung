<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Alert -->
    <div v-if="alert.show" :class="[
      'fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white',
      alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
    ]">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ alert.message }}</span>
    </div>

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Manajemen Role User</h1>
      <p class="text-gray-600">Kelola role dan permissions untuk user yang telah terdaftar</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ statistics.totalUsers }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Admins</p>
            <p class="text-2xl font-bold text-red-600">{{ statistics.admins }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Event Organizers</p>
            <p class="text-2xl font-bold text-purple-600">{{ statistics.eos }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Regular Users</p>
            <p class="text-2xl font-bold text-green-600">{{ statistics.users }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Cari nama, email, atau phone..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="debounceSearch"
          />
        </div>

        <select
          v-model="filters.role"
          @change="loadUsers"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua Role</option>
          <option v-for="role in availableRoles" :key="role.name" :value="role.name">
            {{ role.name }} ({{ role.users_count }})
          </option>
        </select>

        <select
          v-model="filters.status"
          @change="loadUsers"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <div class="flex justify-center items-center">
                  <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                Tidak ada data user
              </td>
            </tr>
            <tr v-else v-for="user in users" :key="user.id_user" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {{ user.nama.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-semibold text-gray-900">{{ user.nama }}</div>
                    <div class="text-xs text-gray-500">ID: {{ user.id_user }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
                <div class="text-xs text-gray-500">{{ user.phone || '-' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="role in user.roles"
                    :key="role"
                    :class="['px-3 py-1 text-xs font-semibold rounded-full', getRoleBadgeColor(role)]"
                  >
                    {{ role }}
                  </span>
                  <span v-if="user.roles.length === 0" class="text-xs text-gray-400 italic">No roles</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getStatusBadge(user.status)]">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="handleViewUser(user)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="handleChangeRole(user)"
                    class="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                    title="Change Role"
                  >
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Ubah Role
                  </button>
                  <button
                    v-if="user.status === 'active'"
                    @click="handleToggleStatus(user)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Deactivate User"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && pagination.total > 0" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Menampilkan {{ pagination.from }} - {{ pagination.to }} dari {{ pagination.total }} user
        </div>
        <div class="flex gap-2">
          <button
            :disabled="pagination.current_page === 1"
            @click="changePage(pagination.current_page - 1)"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span class="px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 text-blue-600 font-medium">
            {{ pagination.current_page }}
          </span>
          <button
            :disabled="pagination.current_page === pagination.last_page"
            @click="changePage(pagination.current_page + 1)"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Change Role -->
    <div v-if="showModal && modalType === 'roles'" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Ubah Role User</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {{ selectedUser.nama.charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="font-semibold text-gray-900">{{ selectedUser.nama }}</p>
                <p class="text-sm text-gray-500">{{ selectedUser.email }}</p>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Current Role: 
              <span :class="['ml-2 px-3 py-1 text-xs font-semibold rounded-full', getRoleBadgeColor(selectedUser.roles[0] || 'User')]">
                {{ selectedUser.roles[0] || 'User' }}
              </span>
            </label>
          </div>

          <div v-if="loadingRoles" class="text-center py-4">
            <svg class="animate-spin h-6 w-6 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div v-else>
            <label class="block text-sm font-medium text-gray-700 mb-3">Pilih Role Baru:</label>
            <div class="space-y-2">
              <label
                v-for="role in availableRoles"
                :key="role.name"
                :class="[
                  'flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all',
                  selectedRole === role.name 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                ]"
              >
                <div class="flex items-center gap-3">
                  <input
                    type="radio"
                    :value="role.name"
                    v-model="selectedRole"
                    :disabled="submitting"
                    class="w-5 h-5 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <span :class="['inline-block px-3 py-1 text-sm font-semibold rounded-full', getRoleBadgeColor(role.name)]">
                      {{ role.name }}
                    </span>
                    <p class="text-xs text-gray-500 mt-1">{{ getRoleDescription(role.name) }}</p>
                  </div>
                </div>
                <svg v-if="selectedRole === role.name" class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </label>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="closeModal"
              :disabled="submitting"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Batal
            </button>
            <button
              @click="handleSubmitRoleChange"
              :disabled="submitting || !selectedRole || selectedRole === (selectedUser.roles[0] || 'User')"
              class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <svg v-if="submitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal View Details -->
    <div v-if="showModal && modalType === 'view'" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Detail User</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- User Info -->
          <div class="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {{ selectedUser.nama.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ selectedUser.nama }}</h3>
              <p class="text-sm text-gray-600">{{ selectedUser.email }}</p>
              <p class="text-xs text-gray-500">{{ selectedUser.phone || '-' }}</p>
            </div>
          </div>

          <!-- Status & Role -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <span :class="['inline-block px-4 py-2 text-sm font-semibold rounded-full', getStatusBadge(selectedUser.status)]">
                {{ selectedUser.status }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Roles</label>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="role in selectedUser.roles"
                  :key="role"
                  :class="['px-4 py-2 text-sm font-semibold rounded-full', getRoleBadgeColor(role)]"
                >
                  {{ role }}
                </span>
              </div>
            </div>
          </div>

          <!-- Permissions -->
          <div v-if="selectedUser.permissions && selectedUser.permissions.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div class="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 bg-gray-50 rounded-lg">
              <span
                v-for="perm in selectedUser.permissions"
                :key="perm"
                class="px-3 py-1 text-xs bg-white text-gray-700 rounded-full border border-gray-200"
              >
                {{ perm }}
              </span>
            </div>
          </div>

          <!-- Statistics -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Statistik</label>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">Total Transaksi</p>
                <p class="text-2xl font-bold text-blue-600">{{ selectedUser.total_transactions || 0 }}</p>
              </div>
              <div class="p-4 bg-green-50 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">Total Tiket</p>
                <p class="text-2xl font-bold text-green-600">{{ selectedUser.total_tickets || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Joined Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Bergabung</label>
            <p class="text-gray-900">{{ formatDate(selectedUser.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userService, roleService } from '../services'

export default {
  name: 'UserManagementAdmin',
  data() {
    return {
      users: [],
      availableRoles: [],
      loading: false,
      loadingRoles: false,
      submitting: false,
      showModal: false,
      modalType: '',
      selectedUser: null,
      selectedRole: '',
      alert: { show: false, type: '', message: '' },
      filters: {
        search: '',
        role: '',
        status: '',
        per_page: 15
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        total: 0,
        from: 0,
        to: 0
      },
      statistics: {
        totalUsers: 0,
        admins: 0,
        eos: 0,
        users: 0
      },
      searchTimeout: null
    }
  },
  mounted() {
    this.loadUsers()
    this.loadRoles()
  },
  methods: {
    async loadUsers() {
      this.loading = true
      try {
        const params = {
          search: this.filters.search,
          role: this.filters.role,
          status: this.filters.status,
          per_page: this.filters.per_page,
          page: this.pagination.current_page
        }

        const response = await userService.getUsers(params)
        
        if (response.success) {
          this.users = response.data.data || response.data || []
          
          if (response.data.current_page) {
            this.pagination = {
              current_page: response.data.current_page,
              last_page: response.data.last_page,
              total: response.data.total,
              from: response.data.from,
              to: response.data.to
            }
          }
          
          this.calculateStatistics()
        }
      } catch (error) {
        console.error('Error loading users:', error)
        this.showAlert('error', error.message || 'Gagal memuat data user')
      } finally {
        this.loading = false
      }
    },

    async loadRoles() {
      this.loadingRoles = true
      try {
        const response = await roleService.getRoles({
          with_permissions: true,
          with_user_count: true
        })
        
        if (response.success) {
          this.availableRoles = response.data || []
        }
      } catch (error) {
        console.error('Error loading roles:', error)
        this.showAlert('error', 'Gagal memuat data role')
      } finally {
        this.loadingRoles = false
      }
    },

    calculateStatistics() {
      this.statistics.totalUsers = this.users.length
      this.statistics.admins = this.users.filter(u => u.roles.includes('Admin')).length
      this.statistics.eos = this.users.filter(u => u.roles.includes('EO')).length
      this.statistics.users = this.users.filter(u => u.roles.includes('User') && !u.roles.includes('Admin') && !u.roles.includes('EO')).length
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.pagination.current_page = 1
        this.loadUsers()
      }, 500)
    },

    changePage(page) {
      this.pagination.current_page = page
      this.loadUsers()
    },

    showAlert(type, message) {
      this.alert = { show: true, type, message }
      setTimeout(() => {
        this.alert = { show: false, type: '', message: '' }
      }, 3000)
    },

    handleChangeRole(user) {
      this.selectedUser = user
      this.modalType = 'roles'
      this.selectedRole = user.roles[0] || 'User'
      this.showModal = true
    },

    async handleViewUser(user) {
      this.modalType = 'view'
      this.loading = true
      
      try {
        const response = await userService.getUserById(user.id_user)
        if (response.success) {
          this.selectedUser = response.data
        }
      } catch (error) {
        console.error('Error loading user details:', error)
        this.selectedUser = user
      } finally {
        this.loading = false
      }
      
      this.showModal = true
    },

    async handleToggleStatus(user) {
      if (confirm(`Apakah Anda yakin ingin menonaktifkan user ${user.nama}?`)) {
        try {
          const response = await userService.deleteUser(user.id_user)
          if (response.success) {
            this.showAlert('success', response.message || 'User berhasil dinonaktifkan')
            this.loadUsers()
          }
        } catch (error) {
          console.error('Error deactivating user:', error)
          this.showAlert('error', error.message || 'Gagal menonaktifkan user')
        }
      }
    },

    async handleSubmitRoleChange() {
      if (!this.selectedRole || this.selectedRole === (this.selectedUser.roles[0] || 'User')) {
        return
      }

      this.submitting = true
      
      try {
        const currentRole = this.selectedUser.roles[0] || 'User'
        
        // Remove current role
        if (currentRole) {
          await userService.removeRole(this.selectedUser.id_user, currentRole)
        }
        
        // Assign new role
        await userService.assignRole(this.selectedUser.id_user, this.selectedRole)
        
        this.showAlert('success', `Role berhasil diubah menjadi ${this.selectedRole}`)
        this.closeModal()
        this.loadUsers()
      } catch (error) {
        console.error('Error changing role:', error)
        const errorMessage = error.message || error.errors || 'Terjadi kesalahan'
        this.showAlert('error', typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage)
      } finally {
        this.submitting = false
      }
    },

    closeModal() {
      this.showModal = false
      this.selectedUser = null
      this.selectedRole = ''
      this.modalType = ''
    },

    getRoleBadgeColor(role) {
      const colors = {
        'Admin': 'bg-red-100 text-red-800 border-red-200',
        'EO': 'bg-purple-100 text-purple-800 border-purple-200',
        'User': 'bg-green-100 text-green-800 border-green-200'
      }
      return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200'
    },

    getStatusBadge(status) {
      return status === 'active' 
        ? 'bg-green-100 text-green-800 border-green-200' 
        : 'bg-red-100 text-red-800 border-red-200'
    },

    getRoleDescription(role) {
      const descriptions = {
        'Admin': 'Full access ke semua fitur sistem',
        'EO': 'Dapat membuat dan mengelola event',
        'User': 'Dapat melihat event dan membeli tiket'
      }
      return descriptions[role] || ''
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
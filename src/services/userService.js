import axiosInstance from '../config/axios'

export const userService = {
  // Get all users with filters
  async getUsers(params = {}) {
    try {
      const response = await axiosInstance.get('/users', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get single user by ID
  async getUserById(id) {
    try {
      const response = await axiosInstance.get(`/users/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Create new user
  async createUser(userData) {
    try {
      const response = await axiosInstance.post('/users', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update user
  async updateUser(id, userData) {
    try {
      const response = await axiosInstance.put(`/users/${id}`, userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete user (deactivate)
  async deleteUser(id) {
    try {
      const response = await axiosInstance.delete(`/users/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Assign role to user
  async assignRole(userId, roleName) {
    try {
      const response = await axiosInstance.post(`/users/${userId}/assign-role`, {
        role: roleName
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Remove role from user
  async removeRole(userId, roleName) {
    try {
      const response = await axiosInstance.post(`/users/${userId}/remove-role`, {
        role: roleName
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get user permissions
  async getUserPermissions(userId) {
    try {
      const response = await axiosInstance.get(`/users/${userId}/permissions`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Give permission to user
  async givePermission(userId, permissionName) {
    try {
      const response = await axiosInstance.post(`/users/${userId}/give-permission`, {
        permission: permissionName
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Revoke permission from user
  async revokePermission(userId, permissionName) {
    try {
      const response = await axiosInstance.post(`/users/${userId}/revoke-permission`, {
        permission: permissionName
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}
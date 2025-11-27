import axiosInstance from '../config/axios'

export const roleService = {
  // Get all roles
  async getRoles(params = {}) {
    try {
      const response = await axiosInstance.get('/roles', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Create new role
  async createRole(roleData) {
    try {
      const response = await axiosInstance.post('/roles', roleData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update role
  async updateRole(id, roleData) {
    try {
      const response = await axiosInstance.put(`/roles/${id}`, roleData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete role
  async deleteRole(id) {
    try {
      const response = await axiosInstance.delete(`/roles/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Assign permission to role
  async assignPermission(roleId, permissionName) {
    try {
      const response = await axiosInstance.post(`/roles/${roleId}/assign-permission`, {
        permission: permissionName
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Remove permission from role
  async removePermission(roleId, permissionName) {
    try {
      const response = await axiosInstance.post(`/roles/${roleId}/remove-permission`, {
        permission: permissionName
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}
import axiosInstance from '../config/axios'

export const permissionService = {
  // Get all permissions
  async getPermissions(params = {}) {
    try {
      const response = await axiosInstance.get('/api/permissions', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Create new permission
  async createPermission(permissionData) {
    try {
      const response = await axiosInstance.post('/api/permissions', permissionData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update permission
  async updatePermission(id, permissionData) {
    try {
      const response = await axiosInstance.put(`/api/permissions/${id}`, permissionData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete permission
  async deletePermission(id) {
    try {
      const response = await axiosInstance.delete(`/api/permissions/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}
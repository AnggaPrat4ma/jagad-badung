// src/services/jenisTiketService.js
import axiosInstance from '../config/axios'

export const jenisTiketService = {
  // Get all jenis tiket (filtered by role)
  async getJenisTiket(params = {}) {
    try {
      const response = await axiosInstance.get('/jenis-tiket', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get jenis tiket by event ID
  async getByEvent(eventId) {
    try {
      const response = await axiosInstance.get(`/jenis-tiket/event/${eventId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get single jenis tiket by ID
  async getJenisTiketById(id) {
    try {
      const response = await axiosInstance.get(`/jenis-tiket/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Check availability (kuota tersisa)
  async checkAvailability(id) {
    try {
      const response = await axiosInstance.get(`/jenis-tiket/${id}/available`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Create new jenis tiket (Owner only)
  async createJenisTiket(tiketData) {
    try {
      const response = await axiosInstance.post('/jenis-tiket', tiketData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update jenis tiket (Owner only)
  async updateJenisTiket(id, tiketData) {
    try {
      const response = await axiosInstance.put(`/jenis-tiket/${id}`, tiketData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete jenis tiket (Owner only)
  async deleteJenisTiket(id) {
    try {
      const response = await axiosInstance.delete(`/jenis-tiket/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

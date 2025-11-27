// src/services/eventService.js
import axiosInstance from '../config/axios'

export const eventService = {
  // Get all events (filtered by role)
  async getEvents(params = {}) {
    try {
      const response = await axiosInstance.get('/events', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get my managed events (as owner or panitia)
  async getMyManagedEvents() {
    try {
      const response = await axiosInstance.get('/events/my-managed')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get single event by ID
  async getEventById(id) {
    try {
      const response = await axiosInstance.get(`/events/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Create new event (EO & Admin only)
  async createEvent(eventData) {
    try {
      const formData = new FormData()
      
      // ✅ Always append required fields
      formData.append('nama_event', eventData.nama_event)
      formData.append('deskripsi', eventData.deskripsi || '')
      formData.append('lokasi', eventData.lokasi)
      formData.append('start_time', eventData.start_time)
      formData.append('end_time', eventData.end_time)
      formData.append('berbayar', eventData.berbayar ? '1' : '0')
      
      // ✅ Only append banner if it's a File object
      if (eventData.banner instanceof File) {
        formData.append('banner', eventData.banner)
      }

      const response = await axiosInstance.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update event (Owner & Admin only)
  async updateEvent(id, eventData) {
    try {
      const formData = new FormData()
      
      // ✅ Append all fields (required for update)
      formData.append('nama_event', eventData.nama_event)
      formData.append('deskripsi', eventData.deskripsi || '')
      formData.append('lokasi', eventData.lokasi)
      formData.append('start_time', eventData.start_time)
      formData.append('end_time', eventData.end_time)
      formData.append('berbayar', eventData.berbayar ? '1' : '0')
      
      // ✅ Only append banner if new file is uploaded
      if (eventData.banner instanceof File) {
        formData.append('banner', eventData.banner)
      }
      
      // ✅ CRITICAL: Laravel method spoofing for PUT with FormData
      formData.append('_method', 'PUT')

      // ✅ Use POST with _method spoofing (not PUT)
      const response = await axiosInstance.post(`/events/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Update event error:', error.response?.data || error)
      throw error.response?.data || error
    }
  },

  // Delete event (Owner & Admin only)
  async deleteEvent(id) {
    try {
      const response = await axiosInstance.delete(`/events/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get public events (no auth required)
  async getPublicEvents() {
    try {
      const response = await axiosInstance.get('/events/public')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get jenis tiket by event
  async getJenisTiketByEvent(eventId) {
    try {
      const response = await axiosInstance.get(`/events/${eventId}/jenis-tiket`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // ========================================
  // PANITIA MANAGEMENT
  // ========================================

  // Get panitia list for event (Owner only)
  async getEventPanitia(eventId) {
    try {
      const response = await axiosInstance.get(`/events/${eventId}/panitia`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Add panitia to event (Owner only)
  async addPanitia(eventId, userId) {
    try {
      const response = await axiosInstance.post(`/events/${eventId}/add-panitia`, {
        user_id: userId
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Remove panitia from event (Owner only)
  async removePanitia(eventId, userId) {
    try {
      const response = await axiosInstance.post(`/events/${eventId}/remove-panitia`, {
        user_id: userId
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async registerFree(idJenisTiket, jumlahTiket = 1) {
    try {
      const response = await axiosInstance.post('/transaksi/register-free', {
        id_jenis_tiket: idJenisTiket,
        jumlah_tiket: jumlahTiket
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
  
  // Check if can register
  async canRegister(eventId) {
    try {
      const response = await axiosInstance.get(`/transaksi/can-register/${eventId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Transfer event ownership (Owner only)
  async transferOwnership(eventId, newOwnerId) {
    try {
      const response = await axiosInstance.post(`/events/${eventId}/transfer-ownership`, {
        new_owner_id: newOwnerId
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}
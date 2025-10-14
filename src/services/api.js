import axios from 'axios'

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8000/api/v1'
  }
  
  return `${window.location.origin}/api/v1`
}

const API_BASE_URL = getApiBaseUrl()

export const getOverlays = async () => {
  const response = await axios.get(`${API_BASE_URL}/overlays`)
  return response.data.data
}

export const getOverlay = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/overlays/${id}`)
  return response.data.data
}

export const createOverlay = async (overlayData) => {
  const response = await axios.post(`${API_BASE_URL}/overlays`, overlayData)
  return response.data.data
}

export const updateOverlay = async (id, overlayData) => {
  const response = await axios.put(`${API_BASE_URL}/overlays/${id}`, overlayData)
  return response.data.data
}

export const deleteOverlay = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/overlays/${id}`)
  return response.data
}

export const getStreams = async () => {
  const response = await axios.get(`${API_BASE_URL}/streams`)
  return response.data.data
}

export const createStream = async (streamData) => {
  const response = await axios.post(`${API_BASE_URL}/streams`, streamData)
  return response.data.data
}

export const startStream = async (id) => {
  const response = await axios.post(`${API_BASE_URL}/streams/${id}/start`)
  return response.data
}

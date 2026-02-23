import axios from 'axios'

// Automatically uses Render backend in production, localhost in development
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: BASE_URL })

export const uploadAudit = (formData, onProgress) =>
  api.post('/audit/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total))
  })

export const getAudit = (id) => api.get(`/audit/${id}`)
export const listAudits = () => api.get('/audits/list')
export const deleteAudit = (id) => api.delete(`/audit/${id}`)
export const healthCheck = () => api.get('/health')

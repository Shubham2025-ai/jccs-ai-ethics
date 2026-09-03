import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const api = axios.create({ baseURL: BASE_URL })

export const startRedTeamAudit = (payload) =>
  api.post('/audit/red-team', payload)

export const testTargetConnection = (payload) =>
  api.post('/audit/test-target-connection', payload)

export const uploadAudit = (formData, onProgress) =>
  api.post('/audit/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total))
  })

// FIX: Robust API endpoints with fallback aliases
export const getAudit = (id) => api.get(`/api/audits/${id}`).catch(() => api.get(`/audit/${id}`))
export const listAudits = () => api.get('/api/audits').catch(() => api.get('/audits/list')).catch(() => api.get('/audit/s/list'))
export const deleteAudit = (id) => api.delete(`/audit/${id}`)
export const healthCheck = () => api.get('/health')
export const verifySignature = (id) => api.get(`/audit/${id}/verify`)

export default api

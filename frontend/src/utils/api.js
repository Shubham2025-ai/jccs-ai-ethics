import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const api = axios.create({ baseURL: BASE_URL })

export const startRedTeamAudit = (payload) =>
  api.post('/audit/red-team', payload)

export const uploadAudit = (formData, onProgress) =>
  api.post('/audit/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total))
  })

export const getAudit = (id) => api.get(`/audit/${id}`)
export const listAudits = () => api.get('/audits/list')
export const deleteAudit = (id) => api.delete(`/audit/${id}`)
export const healthCheck = () => api.get('/health')
export const verifySignature = (id) => api.get(`/audit/${id}/verify`)

export default api

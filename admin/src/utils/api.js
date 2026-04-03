import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
});

export const getStats = () => api.get('/admin/dashboard/stats');
export const banUser = (id) => api.post(\`/admin/users/\${id}/ban\`);
export const verifyUser = (id) => api.post(\`/admin/users/\${id}/verify\`);
export const featureMatch = (id, isFeatured) => api.put(\`/admin/matches/\${id}/feature\`, { isFeatured });

export default api;

import api from './client';

export async function loginAdmin(email, password) {
  const { data } = await api.post('/api/admin/login', { email, password });
  return data;
}

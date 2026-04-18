import api from './client';

export async function submitContactForm(payload) {
  const { data } = await api.post('/api/contact', payload);
  return data;
}

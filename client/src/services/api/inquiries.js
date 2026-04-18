import api from './client';

export async function getContacts(token, filters = {}) {
  const { data } = await api.get('/api/contact', {
    params: filters,
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function getContactStats(token, filters = {}) {
  const { data } = await api.get('/api/contact/stats', {
    params: filters,
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function getContactById(id, token) {
  const { data } = await api.get(`/api/contact/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function updateContactStatus(id, status, token) {
  const { data } = await api.patch(
    `/api/contact/${id}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

export async function updateContactDetails(id, detailsForm, token) {
  const { data } = await api.patch(`/api/contact/${id}/details`, detailsForm, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function updateAssignedTo(id, assignedTo, token) {
  const { data } = await api.patch(
    `/api/contact/${id}/assign`,
    { assignedTo },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

export async function addNote(id, text, token) {
  const { data } = await api.post(
    `/api/contact/${id}/notes`,
    { text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

export async function uploadAttachment(id, file, token) {
  const formData = new FormData();
  formData.append('attachment', file);
  const { data } = await api.post(
    `/api/contact/${id}/attachments`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
}

export async function deleteContact(id, token) {
  const { data } = await api.delete(`/api/contact/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function deleteAttachment(contactId, attachmentId, token) {
  const { data } = await api.delete(
    `/api/contact/${contactId}/attachments/${attachmentId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

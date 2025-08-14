import { api } from '@/lib/api';

export function listCampaigns() {
  return api('/api/campaigns', { method:'GET' });
}
export function createCampaign(payload) {
  return api('/api/campaigns', { method:'POST', body: payload });
}
export function updateCampaign(id, payload) {
  return api(`/api/campaigns/${id}`, { method:'PUT', body: payload });
}
export function deleteCampaign(id) {
  return api(`/api/campaigns/${id}`, { method:'DELETE' });
}
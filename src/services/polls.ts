import { api } from './api';
import type { CommercePoll, VoteResult, Offer } from '../types';

export async function fetchPublicPolls(): Promise<CommercePoll[]> {
  const { data } = await api.get('/polls');
  return data.polls;
}

export async function fetchPublicPoll(id: string): Promise<CommercePoll> {
  const { data } = await api.get(`/polls/${id}`);
  return data.poll;
}

export async function fetchPollResults(pollId: string) {
  const { data } = await api.get(`/polls/${pollId}/results`);
  return data;
}

export async function castVote(pollId: string, choice: 'made' | 'fade', fingerprint?: string): Promise<VoteResult> {
  const { data } = await api.post('/vote', { pollId, choice, fingerprint });
  return data;
}

export async function unlockOffer(pollId: string, email?: string) {
  const { data } = await api.post('/offers/unlock', { pollId, email });
  return data as { discountCode: string; buttonText: string; affiliateUrl: string; disclosure: string };
}

export async function trackOfferClick(pollId: string, offerId: string) {
  await api.post('/offers/click', { pollId, offerId });
}

// ---- Admin ----

export async function fetchAdminPolls(status?: string): Promise<CommercePoll[]> {
  const { data } = await api.get('/polls/admin/all', { params: status ? { status } : {} });
  return data.polls;
}

export async function fetchAdminPoll(id: string): Promise<CommercePoll> {
  const { data } = await api.get(`/polls/admin/${id}`);
  return data.poll;
}

export interface PollFormInput {
  title: string;
  description?: string;
  question: string;
  image?: string;
  videoUrl?: string;
  offerEnabled?: boolean;
  emailRequired?: boolean;
  homepageVisible?: boolean;
  status?: string;
  offers?: Offer[];
}

export async function createPoll(input: PollFormInput): Promise<CommercePoll> {
  const { data } = await api.post('/polls/admin', input);
  return data.poll;
}

export async function updatePoll(id: string, input: Partial<PollFormInput>): Promise<CommercePoll> {
  const { data } = await api.put(`/polls/admin/${id}`, input);
  return data.poll;
}

export async function deletePoll(id: string): Promise<void> {
  await api.delete(`/polls/admin/${id}`);
}

export async function setPollStatus(id: string, status: string): Promise<CommercePoll> {
  const { data } = await api.patch(`/polls/admin/${id}/status`, { status });
  return data.poll;
}

export async function duplicatePoll(id: string): Promise<CommercePoll> {
  const { data } = await api.post(`/polls/admin/${id}/duplicate`);
  return data.poll;
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
}

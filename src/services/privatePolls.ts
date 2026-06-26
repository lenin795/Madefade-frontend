import { api } from './api';
import type { PrivatePoll, PrivatePollQuestionResult } from '../types';

export async function createPrivatePoll(input: {
  name: string;
  questions: string[];
  image?: string;
  videoUrl?: string;
}): Promise<{ poll: PrivatePoll; shareUrl: string }> {
  const { data } = await api.post('/private', input);
  return data;
}

export interface PrivatePollResponse {
  poll: PrivatePoll;
  hasVoted: boolean;
  results: PrivatePollQuestionResult[] | null;
}

export async function fetchPrivatePoll(slug: string): Promise<PrivatePollResponse> {
  const { data } = await api.get(`/private/${slug}`);
  return data;
}

export async function votePrivatePoll(
  slug: string,
  answers: { questionId: string; choice: 'made' | 'fade' }[]
) {
  const { data } = await api.post(`/private/${slug}/vote`, { answers });
  return data as {
    success?: boolean;
    alreadyVoted?: boolean;
    closed?: boolean;
    voteCount?: number;
    results?: PrivatePollQuestionResult[];
  };
}

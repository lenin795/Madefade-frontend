export type PollStatus = 'draft' | 'published' | 'paused' | 'archived';

export interface Offer {
  _id?: string;
  discountCode?: string;
  buttonText: string;
  affiliateUrl: string;
  disclosure: string;
  displayOrder?: number;
}

export interface CommercePoll {
  _id: string;
  title: string;
  description: string;
  question: string;
  image: string;
  videoUrl: string;
  thumbnail: string;
  offerEnabled: boolean;
  emailRequired: boolean;
  homepageVisible: boolean;
  status: PollStatus;
  offers: Offer[];
  madeCount: number;
  fadeCount: number;
  offerUnlockCount: number;
  offerClickCount: number;
  totalVotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface VoteResult {
  success?: boolean;
  alreadyVoted?: boolean;
  madeCount: number;
  fadeCount: number;
  total: number;
  madePercent: number;
  fadePercent: number;
}

export interface PrivatePollQuestion {
  _id: string;
  text: string;
}

export interface PrivatePoll {
  _id: string;
  name: string;
  questions: PrivatePollQuestion[];
  image: string;
  videoUrl: string;
  slug: string;
  maxVotes: number;
  voteCount: number;
  closed: boolean;
}

export interface PrivatePollQuestionResult {
  questionId: string;
  text: string;
  madeCount: number;
  fadeCount: number;
  total: number;
  madePercent: number;
  fadePercent: number;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  lastLoginAt?: string;
}

export interface DashboardSummary {
  totalPolls: number;
  totalVotes: number;
  conversionRate: number;
  emailsCollected: number;
  offerUnlocks: number;
  offerClicks: number;
  activeCampaigns: number;
  pausedCampaigns: number;
}

export interface AnalyticsData {
  votesOverTime: { date: string; count: number }[];
  mostPopularPolls: { title: string; totalVotes: number }[];
  madeVsFadeRatio: { made: number; fade: number };
  emailCaptureRate: number;
  offerClickRate: number;
  campaignPerformance: { title: string; votes: number; unlocks: number; clicks: number }[];
}

export interface EmailCapture {
  _id: string;
  email: string;
  poll: { _id: string; title: string } | null;
  offerCode: string;
  createdAt: string;
}

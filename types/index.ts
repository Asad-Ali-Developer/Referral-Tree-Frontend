export interface School {
  id: string;
  name: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  schoolId: string;
  referralCode: string;
  referredById: string | null;
  createdAt: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
}

export interface ReferralStats {
  directReferrals: number;
  totalReferrals: number;
  referralsByLevel: Record<string, number>;
}

export interface ApiErrorShape {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

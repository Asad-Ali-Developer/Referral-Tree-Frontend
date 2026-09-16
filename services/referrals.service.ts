import { apiClient } from "@/lib/api-client";
import type { ReferralStats, TreeNode, UserProfile } from "@/types";

export const referralsService = {
  createReferral: (
    schoolId: string,
    payload: {
      name: string;
      email: string;
      password: string;
      referralCode: string;
    },
  ) =>
    apiClient
      .post<UserProfile>(`/schools/${schoolId}/referrals`, payload)
      .then((r) => r.data),

  getTree: (schoolId: string, depth?: number) =>
    apiClient
      .get<
        TreeNode[]
      >(`/schools/${schoolId}/referrals/tree`, { params: depth ? { depth } : {} })
      .then((r) => r.data),

  getStats: (schoolId: string, userId?: string) =>
    apiClient
      .get<ReferralStats>(`/schools/${schoolId}/referrals/stats`, {
        params: userId ? { userId } : {},
      })
      .then((r) => r.data),
};

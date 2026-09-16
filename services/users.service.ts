import { apiClient } from "@/lib/api-client";
import type { UserProfile } from "@/types";

export const usersService = {
  me: () => apiClient.get<UserProfile>("/auth/me").then((r) => r.data),
};

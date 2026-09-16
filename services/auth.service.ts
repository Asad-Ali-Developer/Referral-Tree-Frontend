import { apiClient } from "@/lib/api-client";
import type { TokenPair } from "@/types";

export const authService = {
  login: (email: string, password: string) =>
    apiClient
      .post<TokenPair>("/auth/login", { email, password })
      .then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<TokenPair>("/auth/refresh", { refreshToken })
      .then((r) => r.data),
};

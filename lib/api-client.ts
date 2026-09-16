import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokenPair,
} from "./token-storage";
import { config } from "@/config";

export const baseUrl = config.serverUrl;

// A separate, interceptor-free client for the one call that must never
// itself trigger the refresh flow (or it would recurse).
const rawClient = axios.create({ baseURL: baseUrl });

export const apiClient = axios.create({ baseURL: baseUrl });

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Concurrent requests that all 401 at once must share a single
// in-flight refresh call, not each trigger their own — this is the
// lock/queue for that.
let refreshPromise: Promise<string> | null = null;

function onAuthFailure() {
  clearTokens();
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  const { data } = await rawClient.post("/auth/refresh", { refreshToken });
  setTokenPair(data);
  return data.accessToken;
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // The login/refresh endpoints themselves returning 401 means the
    // credentials are actually wrong — don't try to "refresh" that.
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise = refreshPromise ?? refreshAccessToken();
      const newAccessToken = await refreshPromise;
      refreshPromise = null;

      originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
      return apiClient(originalRequest);
    } catch (refreshError) {
      refreshPromise = null;
      onAuthFailure();
      return Promise.reject(refreshError);
    }
  },
);

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string | string[] }
      | undefined;
    if (Array.isArray(data?.message)) return data.message[0];
    if (typeof data?.message === "string") return data.message;
  }
  return "Something went wrong. Try again.";
}


"use client";

import { useAuth } from "@clerk/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface FetchOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  skipAuth?: boolean;
  getToken?: () => Promise<string | null>;
}

class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function getBrowserToken(): Promise<string | null> {
  try {
    const clerk = (window as any).Clerk;
    if (clerk?.session) {
      return await clerk.session.getToken();
    }
    return null;
  } catch {
    return null;
  }
}

async function refreshAndRetry(
  url: string,
  options: FetchOptions,
): Promise<Response> {
  try {
    const clerk = (window as any).Clerk;
    if (clerk?.session) {
      const freshToken = await clerk.session.getToken({ skipCache: true });
      const retryHeaders: Record<string, string> = {
        ...options.headers,
        Authorization: `Bearer ${freshToken}`,
      };
      return fetch(url, { ...options, headers: retryHeaders });
    }
    throw new ApiError(401, "SESSION_EXPIRED", "Session expired. Please sign in again.");
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(401, "UNAUTHORIZED", "Authentication required.");
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  options: FetchOptions,
  retries = 3,
): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, { ...options, signal: options.signal });

      if (response.status === 401) {
        return refreshAndRetry(url, options);
      }

      if (response.status >= 500 && attempt < retries - 1) {
        const backoff = Math.pow(2, attempt) * 1000;
        await delay(backoff);
        continue;
      }

      return response;
    } catch (err) {
      if (attempt === retries - 1) throw err;
      const backoff = Math.pow(2, attempt) * 1000;
      await delay(backoff);
    }
  }

  throw new Error("Max retries exceeded");
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { skipAuth = false, headers: customHeaders = {}, getToken, ...rest } = options;

  const url = `${API_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (!skipAuth) {
    const resolveToken = getToken ?? getBrowserToken;
    const token = await resolveToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetchWithRetry(url, {
    ...rest,
    headers,
  });

  if (!response.ok) {
    let body: Record<string, unknown> = {};
    try {
      body = await response.json();
    } catch {
      // Response may not be JSON
    }

    const message =
      (typeof body.message === "string" ? body.message : undefined) ||
      (typeof body.error === "string" ? body.error : undefined) ||
      (typeof body.error === "object" && body.error !== null ? (body.error as any).message : undefined) ||
      `Request failed with status ${response.status}`;
    const code =
      (typeof body.error === "string" ? body.error : undefined) ||
      (typeof body.error === "object" && body.error !== null ? (body.error as any).code : undefined) ||
      response.statusText || "UNKNOWN_ERROR";

    throw new ApiError(response.status, code, message);
  }

  const data = await response.json();
  return data as T;
}

export function useApiFetch() {
  const { getToken } = useAuth();

  return function api<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
    return apiFetch<T>(path, { ...options, getToken });
  };
}

export function useCruxApi() {
  const api = useApiFetch();
  return { api };
}

export { ApiError };
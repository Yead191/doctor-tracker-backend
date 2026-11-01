/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { getAccessToken } from "./getAccessToken";

export interface Pagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface FetchResponse<T = any> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
  error?: string | any | null;
  pagination?: Pagination;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: any;
  token?: string;
  headers?: Record<string, string>;
  cache?: RequestCache;
  tags?: string[];
  next?: NextFetchRequestConfig;
}

export const nextFetch = async <T = any>(
  url: string,
  {
    method = "GET",
    body,
    tags,
    token,
    headers = {},
    cache = "default",
    next = {},
  }: FetchOptions = {}
): Promise<FetchResponse<T>> => {
  const accessToken = await getAccessToken();
  const isFormData = body instanceof FormData;
  const hasBody = body !== undefined && method !== "GET";

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(token ? { Authorization: `${token}` } : {}),
  };

  const rawBaseUrl =
    process.env.BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:5000/api/v1";
  const baseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  try {
    const res = await fetch(`${baseUrl}${url}`, {
      method,
      headers: reqHeaders,
      ...(hasBody && {
        body: isFormData ? body : JSON.stringify(body),
      }),
      cache: method === "GET" ? cache : "no-store",
      next: {
        ...next,
        ...(tags && { tags }),
      },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const isAuthError = res.status === 401 || res.status === 403;

      if (isAuthError) {
        try {
          const cookieStore = await cookies();
          cookieStore.delete("accessToken");
          cookieStore.delete("role");
          cookieStore.delete("user");
        } catch {
          // Cookies cannot be modified during static render
        }
      }

      return {
        success: false,
        statusCode: res.status,
        message: json?.message || "Request failed",
        error: json?.errorMessages || json?.message || "Request failed",
      };
    }

    return {
      success: true,
      statusCode: res.status,
      message: json?.message,
      data: json?.data,
      error: null,
      pagination: json?.pagination,
    };
  } catch (err) {
    return {
      success: false,
      message: "Network error",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};


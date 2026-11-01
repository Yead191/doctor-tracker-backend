"use server";

import { cookies } from "next/headers";
import { nextFetch, FetchResponse } from "./NextFetch";

export interface LoginResponseData {
  createToken: string;
  role?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}): Promise<FetchResponse<LoginResponseData>> {
  const res = await nextFetch<LoginResponseData>("/auth/login", {
    method: "POST",
    body: credentials,
  });

  if (res.success && res.data?.createToken) {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", res.data.createToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    if (res.data.role) {
      cookieStore.set("role", res.data.role, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }
  }

  return res;
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("role");
  cookieStore.delete("user");
  return { success: true };
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const role = cookieStore.get("role")?.value;
  return {
    isAuthenticated: Boolean(token),
    token,
    role,
  };
}


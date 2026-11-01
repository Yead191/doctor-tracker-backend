"use server";

import { nextFetch, FetchResponse } from "./NextFetch";
import { IDashboardAnalytics } from "@/types";

export async function getDashboardAnalytics(): Promise<
  FetchResponse<IDashboardAnalytics>
> {
  return nextFetch<IDashboardAnalytics>("/dashboard/analytics", {
    method: "GET",
    next: {
      tags: ["dashboard"],
      revalidate: 60 * 30,
    },
    cache: "force-cache",
  });
}

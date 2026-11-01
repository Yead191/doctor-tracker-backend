"use server";

import { nextFetch, FetchResponse } from "./NextFetch";
import { revalidateTags } from "./revalidateTags";
import { IPatient, PatientQueryParams } from "@/types";

export async function getPatients(
  params: PatientQueryParams = {}
): Promise<FetchResponse<IPatient[]>> {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.searchTerm?.trim()) query.set("searchTerm", params.searchTerm.trim());
  if (params.condition && params.condition !== "all") {
    query.set("condition", params.condition);
  }
  if (params.status && params.status !== "all") {
    query.set("status", params.status);
  }
  if (params.gender && params.gender !== "all") {
    query.set("gender", params.gender);
  }
  if (params.doctor && params.doctor !== "all") {
    query.set("doctor", params.doctor);
  }
  if (params.startDate) query.set("startDate", params.startDate);
  if (params.endDate) query.set("endDate", params.endDate);
  if (params.sort) query.set("sort", params.sort);

  const qs = query.toString();
  const endpoint = `/patients${qs ? `?${qs}` : ""}`;

  return nextFetch<IPatient[]>(endpoint, {
    method: "GET",
    next: {
      tags: ["patients"],
    },
    cache: "no-store",
  });
}

export async function getPatientById(id: string): Promise<FetchResponse<IPatient>> {
  return nextFetch<IPatient>(`/patients/${id}`, {
    method: "GET",
    next: {
      tags: ["patients", `patient-${id}`],
    },
    cache: "no-store",
  });
}

export async function createPatient(
  payload: FormData | Record<string, any>
): Promise<FetchResponse<IPatient>> {
  const res = await nextFetch<IPatient>("/patients", {
    method: "POST",
    body: payload,
  });

  if (res.success) {
    await revalidateTags(["patients", "doctors", "dashboard"]);
  }

  return res;
}

export async function updatePatient(
  id: string,
  payload: FormData | Record<string, any>
): Promise<FetchResponse<IPatient>> {
  const res = await nextFetch<IPatient>(`/patients/${id}`, {
    method: "PATCH",
    body: payload,
  });

  if (res.success) {
    await revalidateTags(["patients", `patient-${id}`, "dashboard"]);
  }

  return res;
}

export async function deletePatient(id: string): Promise<FetchResponse<any>> {
  const res = await nextFetch(`/patients/${id}`, {
    method: "DELETE",
  });

  if (res.success) {
    await revalidateTags(["patients", "doctors", "dashboard"]);
  }

  return res;
}


"use server";

import { revalidatePath } from "next/cache";
import { nextFetch, FetchResponse } from "./NextFetch";
import { revalidateTags } from "./revalidateTags";
import { DoctorQueryParams, IDoctor, IPatient } from "@/types";

export async function getDoctors(
  params: DoctorQueryParams = {},
): Promise<FetchResponse<IDoctor[]>> {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.searchTerm?.trim())
    query.set("searchTerm", params.searchTerm.trim());
  if (params.specialization && params.specialization !== "all") {
    query.set("specialization", params.specialization);
  }
  if (params.hospital && params.hospital !== "all") {
    query.set("hospital", params.hospital);
  }
  if (params.status && params.status !== "all") {
    query.set("status", params.status);
  }
  if (params.startDate) query.set("startDate", params.startDate);
  if (params.endDate) query.set("endDate", params.endDate);
  if (params.sort) query.set("sort", params.sort);

  const qs = query.toString();
  const endpoint = `/doctors${qs ? `?${qs}` : ""}`;

  return nextFetch<IDoctor[]>(endpoint, {
    method: "GET",
    next: {
      tags: ["doctors"],
      revalidate: 60 * 10,
    },
    cache: "force-cache",
  });
}

export async function getDoctorById(
  id: string,
): Promise<FetchResponse<IDoctor>> {
  return nextFetch<IDoctor>(`/doctors/${id}`, {
    method: "GET",
    next: {
      tags: ["doctors", `doctor-${id}`],
      revalidate: 60 * 10,
    },
    cache: "force-cache",
  });
}

export async function getDoctorPatients(
  doctorId: string,
  params: {
    page?: number | string;
    limit?: number | string;
    searchTerm?: string;
  } = {},
): Promise<FetchResponse<{ doctor: IDoctor; patients: IPatient[] }>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.searchTerm?.trim())
    query.set("searchTerm", params.searchTerm.trim());

  const qs = query.toString();
  const endpoint = `/doctors/${doctorId}/patients${qs ? `?${qs}` : ""}`;

  return nextFetch<{ doctor: IDoctor; patients: IPatient[] }>(endpoint, {
    method: "GET",
    next: {
      tags: ["doctors", `doctor-${doctorId}-patients`],
      revalidate: 60 * 10,
    },
    cache: "force-cache",
  });
}

export async function createDoctor(
  payload: FormData | Record<string, any>,
): Promise<FetchResponse<IDoctor>> {
  const res = await nextFetch<IDoctor>("/doctors", {
    method: "POST",
    body: payload,
  });

  if (res.success) {
    await revalidateTags(["doctors", "dashboard"]);
    revalidatePath("/doctors");
    revalidatePath("/dashboard");
  }

  return res;
}

export async function updateDoctor(
  id: string,
  payload: FormData | Record<string, any>,
): Promise<FetchResponse<IDoctor>> {
  const res = await nextFetch<IDoctor>(`/doctors/${id}`, {
    method: "PATCH",
    body: payload,
  });

  if (res.success) {
    await revalidateTags(["doctors", `doctor-${id}`, "dashboard"]);
    revalidatePath(`/doctors/${id}`);
    revalidatePath("/doctors");
    revalidatePath("/dashboard");
  }

  return res;
}

export async function deleteDoctor(id: string): Promise<FetchResponse<any>> {
  const res = await nextFetch(`/doctors/${id}`, {
    method: "DELETE",
  });

  if (res.success) {
    await revalidateTags(["doctors", "patients", "dashboard"]);
    revalidatePath("/doctors");
    revalidatePath("/patients");
    revalidatePath("/dashboard");
  }

  return res;
}

export async function addPatientToDoctor(
  doctorId: string,
  payload: FormData | Record<string, any>,
): Promise<FetchResponse<IPatient>> {
  const res = await nextFetch<IPatient>(`/doctors/${doctorId}/patients`, {
    method: "POST",
    body: payload,
  });

  if (res.success) {
    await revalidateTags([
      "doctors",
      `doctor-${doctorId}-patients`,
      "patients",
      "dashboard",
    ]);
    revalidatePath(`/doctors/${doctorId}`);
    revalidatePath("/doctors");
    revalidatePath("/patients");
    revalidatePath("/dashboard");
  }

  return res;
}

export async function removePatientFromDoctor(
  doctorId: string,
  patientId: string,
): Promise<FetchResponse<any>> {
  const res = await nextFetch(`/doctors/${doctorId}/patients/${patientId}`, {
    method: "DELETE",
  });

  if (res.success) {
    await revalidateTags([
      "doctors",
      `doctor-${doctorId}-patients`,
      "patients",
      "dashboard",
    ]);
    revalidatePath(`/doctors/${doctorId}`);
    revalidatePath("/doctors");
    revalidatePath("/patients");
    revalidatePath("/dashboard");
  }

  return res;
}

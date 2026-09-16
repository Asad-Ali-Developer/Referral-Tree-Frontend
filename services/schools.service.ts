import { apiClient } from "@/lib/api-client";
import type { School, UserProfile } from "@/types";

export const schoolsService = {
  createSchool: (name: string) =>
    apiClient.post<School>("/schools", { name }).then((r) => r.data),

  createRootUser: (
    schoolId: string,
    name: string,
    email: string,
    password: string,
  ) =>
    apiClient
      .post<UserProfile>(`/schools/${schoolId}/root-users`, {
        name,
        email,
        password,
      })
      .then((r) => r.data),
};

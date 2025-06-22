import { Profile } from "@/interfaces";
import { api } from "@/lib/axios";

export const createProfile = async (profileData: Partial<Profile>): Promise<Profile> => {
  const response = await api.post<Profile>('/me/profile/', profileData);

  return response.data;
}
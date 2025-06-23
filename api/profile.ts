import { Profile } from "@/interfaces";
import { api } from "@/lib/axios";

export const createProfile = async (profileData: Partial<Profile>): Promise<Profile> => {
  console.log('Creating profile with data:', profileData);
  const response = await api.post<Profile>('/users/me/profile/', profileData);

  return response.data;
}

export const getProfile = async (): Promise<Profile> => {
  const response = await api.get<Profile>('/users/me/profile/');
  return response.data;
}
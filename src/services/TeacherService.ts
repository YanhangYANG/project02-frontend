import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import type { Teacher } from "@/type";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  getAllteachers(): Promise<AxiosResponse<Teacher[]>> {
    return apiClient.get<Teacher[]>("/advisors");
  },
  getTeachers(
    perPage: number,
    page: number,
  ): Promise<AxiosResponse<Teacher[]>> {
    return apiClient.get<Teacher[]>(
      "/advisors?_limit=" + perPage + "&_page=" + page,
    );
  },
  getTeacherById(id: string): Promise<AxiosResponse<Teacher>> {
    return apiClient.get<Teacher>(
      "advisors/" + id.toString(),
    );
  },
};

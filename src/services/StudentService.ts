import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import type { Student } from "@/type";
import type { Teacher } from "@/type";
import { inject, provide } from "vue";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  getStudents(
    perPage: number,
    page: number,
  ): Promise<AxiosResponse<Student[]>> {

    return apiClient.get<Student[]>(
      "/students?_limit=" + perPage + "&_page=" + page,
    );
  },
  getStudentById(studentId: string): Promise<AxiosResponse<Student>> {
    return apiClient.get<Student>("/students/?id=" + studentId.toString());
  },

  getTeacherByTeacherID(id: string): Promise<AxiosResponse<Teacher>> {
    return apiClient.get<Teacher>("advisors/" + id.toString());
  },


};



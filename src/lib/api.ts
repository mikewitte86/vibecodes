import axios, { InternalAxiosRequestConfig } from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { User, UsersResponse } from "@/types/api";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

export const userApi = {
  getUsers: async (paginationToken?: string): Promise<UsersResponse> => {
    const params = new URLSearchParams();
    params.set("limit", "15");
    if (paginationToken) {
      params.set("pagination_token", paginationToken);
    }

    const response = await api.get<UsersResponse>(
      `/users?${params.toString()}`,
    );
    return response.data;
  },

  createUser: async (
    user: Omit<
      User,
      "username" | "status" | "enabled" | "created_at" | "last_modified"
    >,
  ): Promise<User> => {
    const response = await api.post<User>("/users", user);
    return response.data;
  },

  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await api.put<User>(
      `/users?id=${encodeURIComponent(id)}`,
      user,
    );
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users?id=${encodeURIComponent(id)}`);
  },
};

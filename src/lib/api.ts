import axios, { InternalAxiosRequestConfig } from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { User, UsersResponse } from "@/types/api";

export interface LineOfBusiness {
  databaseId: string;
  lineOfBusinessName: string;
  policyDatabaseId: string;
  lineOfBusinessId: string;
  lineOfBusinessClassId: string;
  lineOfBusinessClassName: string;
}

export interface Insured {
  id: string;
  name: string;
}

export interface Policy {
  id: string;
  number: string;
  effective_date: string;
  expiration_date: string;
  carrier: string;
  line_of_business: LineOfBusiness[];
  status: string;
  premium: number;
  insured: Insured;
}

export interface Pagination {
  total_items: number;
  fetch_all: boolean;
  limit_per_page: number;
  offset: number;
}

export interface PoliciesResponse {
  statusCode: number;
  body: {
    policies: Policy[];
    count: number;
    filter_applied: string;
    pagination: Pagination;
  };
}

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

export const policyApi = {
  getPolicies: async (agencyId?: string, customerId?: string): Promise<PoliciesResponse> => {
    const params = new URLSearchParams();
    if (agencyId) {
      params.set('agency_id', agencyId);
    }
    if (customerId) {
      params.set('by_customer', customerId);
    }
    const response = await api.get<PoliciesResponse>(`/policies?${params.toString()}`);
    return response.data;
  },
};

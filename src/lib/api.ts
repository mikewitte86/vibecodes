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

export interface Customer {
  id: string;
  tenant_id: string;
  owner_id: string;
  created_at: string;
  updated_at: string | null;
  name: string;
  phone: string | null;
  status: string;
  nowcerts_id: string;
  hubspot_id: string;
  broker_buddha_id: string | null;
  is_prospect: boolean;
  GSI1SK: string;
  GSI2SK: string;
  GSI3SK: string;
  GSI4SK: string;
}

export interface CustomersResponse {
  statusCode: number;
  body: {
    customers: Customer[];
    count: number;
    last_evaluated_key: string | null;
  };
}

export interface Application {
  id: string;
  name: string;
  status: string;
  open_status: string | null;
  application_type: string;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  closed_at: string | null;
  brokerage_firm: { name: string };
  company: {
    id: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  lines_of_business: { title?: string }[];
}

export interface ApplicationsPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApplicationsResponse {
  statusCode: number;
  body: {
    applications: Application[];
    count: number;
    pagination: ApplicationsPagination;
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

export const customerApi = {
  getCustomers: async (agencyId?: string): Promise<CustomersResponse> => {
    const params = new URLSearchParams();
    if (agencyId) {
      params.set('agency_id', agencyId);
    }
    const response = await api.get<CustomersResponse>(`/customers?${params.toString()}`);
    return response.data;
  },
};

export const applicationsApi = {
  getApplications: async (page: number = 1, perPage: number = 10): Promise<ApplicationsResponse> => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("per_page", String(perPage));
    const response = await api.get(`/submissions/applications?${params.toString()}`);
    return response.data;
  },
};

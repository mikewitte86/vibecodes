export interface User {
  username: string;
  status: string;
  enabled: boolean;
  created_at: string;
  last_modified: string;
  email: string;
  name: string;
  agency_id: string;
  user_role: string;
}

export interface UsersResponse {
  users: User[];
  count: number;
  pagination_token?: string;
} 
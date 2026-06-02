import { UserRole } from './constants';

export interface User {
  id: string; email: string; name: string; role: UserRole;
  organization: string | null; is_active: boolean; created_at: string; updated_at?: string;
}

export interface AuthState {
  user: User | null; isAuthenticated: boolean; token: string | null;
}

export interface AuthTokens {
  access_token: string;
  token_type: 'bearer';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  organization?: string;
}

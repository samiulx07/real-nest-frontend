export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF" | "CUSTOMER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
}

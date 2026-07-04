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

export interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  projectName: string;
  location: string;
  price: string;
  totalFloor: string;
  units: string;
  parking: string;
  gym: string;
}

export interface FeaturedProject {
  id: number;
  image: string;
  projectName: string;
  location: string;
  totalFloor: string;
  unitsPerFloor: string;
  size: string;
}

export interface Differentiator {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

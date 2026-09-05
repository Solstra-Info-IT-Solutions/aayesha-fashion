export type CustomerGender =
  | "male"
  | "female"
  | "other"
  | null;

export type CustomerProfileUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: "customer" | "admin";
  status:
    | "active"
    | "inactive"
    | "suspended"
    | "blocked";
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CustomerProfileCustomer = {
  id: string;
  userId: string;
  phone: string;
  dateOfBirth: string | null;
  gender: CustomerGender;
  preferredSizes: string[];
  preferredColors: string[];
  marketingEmails: boolean;
  marketingWhatsapp: boolean;
  lastOrderAt: string | null;
  totalOrders: number;
  totalSpent: number;
  status:
    | "active"
    | "inactive"
    | "suspended"
    | "blocked";
  createdAt: string;
  updatedAt: string;
};

export type CustomerProfile = {
  user: CustomerProfileUser;
  customer: CustomerProfileCustomer;
};

export type CustomerProfileResponse = {
  success: boolean;
  data: CustomerProfile;
  message?: string;
};

export type UpdateCustomerProfilePayload = {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string | null;
  gender?: CustomerGender;
  preferredSizes?: string[];
  preferredColors?: string[];
  marketingEmails?: boolean;
  marketingWhatsapp?: boolean;
};

export type UpdateCustomerProfileResponse = {
  success: boolean;
  data: CustomerProfile;
  message?: string;
};
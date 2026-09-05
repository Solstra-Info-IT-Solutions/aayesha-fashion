import { apiFetch } from "@/lib/api";

import type {
  CustomerProfile,
  UpdateCustomerProfilePayload,
} from "@/types/customer";

export async function getCustomerProfile(
  accessToken: string,
): Promise<CustomerProfile> {
  return apiFetch<CustomerProfile>(
    "/customer/profile",
    {
      method: "GET",
      accessToken,
    },
  );
}

export async function updateCustomerProfile(
  accessToken: string,
  payload: UpdateCustomerProfilePayload,
): Promise<CustomerProfile> {
  return apiFetch<CustomerProfile>(
    "/customer/profile",
    {
      method: "PATCH",
      accessToken,
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteCustomerAccount(
  accessToken: string,
): Promise<{
  success: true;
  message: string;
}> {
  return apiFetch<{
    success: true;
    message: string;
  }>("/customer/account", {
    method: "DELETE",
    accessToken,
  });
}
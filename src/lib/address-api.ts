import { apiFetch } from "@/lib/api";
import type {
  Address,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "@/types/address";

export async function getAddresses(
  accessToken: string,
): Promise<Address[]> {
  return apiFetch<Address[]>("/customer/addresses", {
    method: "GET",
    accessToken,
  });
}

export async function getAddress(
  accessToken: string,
  addressId: string,
): Promise<Address> {
  return apiFetch<Address>(`/customer/addresses/${addressId}`, {
    method: "GET",
    accessToken,
  });
}

export async function createAddress(
  accessToken: string,
  payload: CreateAddressPayload,
): Promise<Address> {
  return apiFetch<Address>("/customer/addresses", {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload),
  });
}

export async function updateAddress(
  accessToken: string,
  addressId: string,
  payload: UpdateAddressPayload,
): Promise<Address> {
  return apiFetch<Address>(`/customer/addresses/${addressId}`, {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(payload),
  });
}

export async function deleteAddress(
  accessToken: string,
  addressId: string,
): Promise<void> {
  await apiFetch<void>(`/customer/addresses/${addressId}`, {
    method: "DELETE",
    accessToken,
  });
}

export async function setDefaultAddress(
  accessToken: string,
  addressId: string,
): Promise<Address> {
  return apiFetch<Address>(
    `/customer/addresses/${addressId}/default`,
    {
      method: "PATCH",
      accessToken,
    },
  );
}
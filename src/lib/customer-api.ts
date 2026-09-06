import { apiFetch } from "@/lib/api";

import type {
  CustomerProfile,
  UpdateCustomerProfilePayload,
} from "@/types/customer";

/* =========================================================
   TYPES
========================================================= */

export type CustomerAddress = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCustomerAddressPayload = {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
};

export type UpdateCustomerAddressPayload =
  Partial<CreateCustomerAddressPayload>;

export type DeleteCustomerAddressResponse = {
  success: true;
  message: string;
};

/* =========================================================
   CUSTOMER PROFILE
========================================================= */

/**
 * Get the currently authenticated customer's profile.
 */
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

/**
 * Update the currently authenticated customer's profile.
 */
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

/* =========================================================
   DELETE CUSTOMER ACCOUNT
========================================================= */

/**
 * Permanently delete/deactivate the authenticated
 * customer's account.
 */
export async function deleteCustomerAccount(
  accessToken: string,
): Promise<{
  success: true;
  message: string;
}> {
  return apiFetch<{
    success: true;
    message: string;
  }>(
    "/customer/account",
    {
      method: "DELETE",
      accessToken,
    },
  );
}

/* =========================================================
   SAVED ADDRESSES
========================================================= */

/**
 * Get all saved addresses belonging to the
 * authenticated customer.
 */
export async function getCustomerAddresses(
  accessToken: string,
): Promise<CustomerAddress[]> {
  return apiFetch<CustomerAddress[]>(
    "/customer/addresses",
    {
      method: "GET",
      accessToken,
    },
  );
}

/**
 * Get one saved address belonging to the
 * authenticated customer.
 */
export async function getCustomerAddress(
  accessToken: string,
  addressId: string,
): Promise<CustomerAddress> {
  const encodedAddressId =
    encodeURIComponent(
      addressId,
    );

  return apiFetch<CustomerAddress>(
    `/customer/addresses/${encodedAddressId}`,
    {
      method: "GET",
      accessToken,
    },
  );
}

/**
 * Create a new saved address.
 */
export async function createCustomerAddress(
  accessToken: string,
  payload: CreateCustomerAddressPayload,
): Promise<CustomerAddress> {
  return apiFetch<CustomerAddress>(
    "/customer/addresses",
    {
      method: "POST",
      accessToken,
      body: JSON.stringify(payload),
    },
  );
}

/**
 * Update an existing saved address.
 *
 * The backend verifies that the address belongs
 * to the authenticated customer.
 */
export async function updateCustomerAddress(
  accessToken: string,
  addressId: string,
  payload: UpdateCustomerAddressPayload,
): Promise<CustomerAddress> {
  const encodedAddressId =
    encodeURIComponent(
      addressId,
    );

  return apiFetch<CustomerAddress>(
    `/customer/addresses/${encodedAddressId}`,
    {
      method: "PATCH",
      accessToken,
      body: JSON.stringify(payload),
    },
  );
}

/**
 * Delete an existing saved address.
 */
export async function deleteCustomerAddress(
  accessToken: string,
  addressId: string,
): Promise<DeleteCustomerAddressResponse> {
  const encodedAddressId =
    encodeURIComponent(
      addressId,
    );

  return apiFetch<DeleteCustomerAddressResponse>(
    `/customer/addresses/${encodedAddressId}`,
    {
      method: "DELETE",
      accessToken,
    },
  );
}

/**
 * Make a saved address the customer's default address.
 */
export async function setCustomerDefaultAddress(
  accessToken: string,
  addressId: string,
): Promise<CustomerAddress> {
  const encodedAddressId =
    encodeURIComponent(
      addressId,
    );

  return apiFetch<CustomerAddress>(
    `/customer/addresses/${encodedAddressId}/default`,
    {
      method: "PATCH",
      accessToken,
    },
  );
}
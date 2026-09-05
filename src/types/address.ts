export type Address = {
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

export type AddressListResponse = {
  success: boolean;
  data: Address[];
  message?: string;
};

export type AddressResponse = {
  success: boolean;
  data: Address;
  message?: string;
};

export type CreateAddressPayload = {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
};

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

export type DeleteAddressResponse = {
  success: boolean;
  message?: string;
};
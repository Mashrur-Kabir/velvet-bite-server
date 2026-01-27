export const USER_ROLE = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER",
} as const;

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  PENDING: "PENDING",
} as const;

export type Role = keyof typeof USER_ROLE;
export type Status = keyof typeof USER_STATUS;

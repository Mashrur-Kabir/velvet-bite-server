// Logic specific to API response

export const sanitizeUserResponse = (user: any) => {
  // ADMIN or CUSTOMER → remove provider-specific fields
  if (user.role !== "PROVIDER") {
    const { providerProfileId, provider, ...safeUser } = user;
    return safeUser;
  }

  return user;
};

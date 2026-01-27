import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { ProviderProfile } from "../../../generated/prisma/client";

const createProviderInDB = async (
  userId: string,
  payload: Omit<
    ProviderProfile,
    "id" | "userId" | "createdAt" | "updatedAt" | "isActive"
  >,
) => {
  const existingProvider = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (existingProvider) {
    throw new AppError(409, "Provider profile already exists");
  }

  const provider = await prisma.providerProfile.create({
    data: {
      ...payload,
      userId,
    },
  });

  return provider;
};

const getMyProviderFromDB = async (userId: string) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
    include: {
      meals: true,
    },
  });

  if (!provider) {
    throw new AppError(404, "Provider profile not found");
  }

  return provider;
};

const updateMyProviderInDB = async (
  userId: string,
  payload: Partial<ProviderProfile>,
) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!provider) {
    throw new AppError(404, "Provider profile not found");
  }

  // prevent changing ownership or identity
  delete (payload as any).id;
  delete (payload as any).userId;
  delete (payload as any).createdAt;
  delete (payload as any).updatedAt;

  const updatedProvider = await prisma.providerProfile.update({
    where: { userId },
    data: payload,
  });

  return updatedProvider;
};

const getProviderByIdFromDB = async (providerId: string) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    include: {
      meals: {
        where: { isAvailable: true },
      },
    },
  });

  if (!provider) {
    throw new AppError(404, "Provider not found");
  }

  return provider;
};

const getAllProvidersFromDB = async () => {
  return prisma.providerProfile.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
};

export const providerService = {
  createProviderInDB,
  getMyProviderFromDB,
  updateMyProviderInDB,
  getProviderByIdFromDB,
  getAllProvidersFromDB,
};

import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { UserStatus } from "../../../generated/prisma/enums";

const getMyProfileFromDB = async (userId: string) => {
  // Fetch user, the provider link, and customer level counts
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      provider: {
        select: { id: true },
      },
      _count: {
        select: {
          orders: true,
          reviews: true,
        },
      },
    },
  });

  if (!user) throw new AppError(404, "User profile not found");

  // Default to customer order count
  let relevantOrderCount = user._count?.orders || 0;

  // If role is PROVIDER, swap to 'Orders Received' count
  if (user.role === "PROVIDER" && user.provider) {
    relevantOrderCount = await prisma.order.count({
      where: { providerId: user.provider.id },
    });
  }

  return {
    ...user,
    _count: {
      reviews: user._count?.reviews || 0,
      orders: relevantOrderCount, // Represents 'Handled' for Providers
    },
  };
};

const updateProfileInDB = async (
  userId: string,
  payload: Partial<{ name: string; phone: string; image: string }>,
) => {
  // Explicitly pick only allowed fields to prevent role/email escalation
  const { name, phone, image } = payload;

  // Build update object
  const updateData: Record<string, any> = {};
  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (image !== undefined) updateData.image = image;

  return await prisma.user.update({
    where: { id: userId },
    data: updateData, // Only the whitelisted fields are passed here
  });
};

const getAllUsersFromDB = async () => {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const updateUserStatusInDB = async (userId: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found");

  return await prisma.user.update({
    where: { id: userId },
    data: { status }, // TypeScript now enforces only ACTIVE or BLOCKED
  });
};

export const userService = {
  getMyProfileFromDB,
  updateProfileInDB,
  getAllUsersFromDB,
  updateUserStatusInDB,
};

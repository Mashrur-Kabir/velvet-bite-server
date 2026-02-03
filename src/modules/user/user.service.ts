import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { UserStatus } from "../../../generated/prisma/enums";

const getMyProfileFromDB = async (userId: string) => {
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

  //ADMIN: return profile WITHOUT _count
  if (user.role === "ADMIN") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _count, ...adminSafeUser } = user;
    return adminSafeUser;
  }

  // Default to customer order count
  let relevantOrderCount = user._count?.orders || 0;

  // PROVIDER: count received orders instead
  if (user.role === "PROVIDER" && user.provider) {
    relevantOrderCount = await prisma.order.count({
      where: { providerId: user.provider.id },
    });
  }

  return {
    ...user,
    _count: {
      reviews: user._count?.reviews || 0,
      orders: relevantOrderCount,
    },
  };
};

const updateProfileInDB = async (
  userId: string,
  payload: Partial<{ name: string; phone: string; image: string }>,
) => {
  // explicitly pick only allowed fields to prevent role/email escalation
  const { name, phone, image } = payload;

  // Build update object
  const updateData: Record<string, any> = {};
  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (image !== undefined) updateData.image = image;

  return await prisma.user.update({
    where: { id: userId },
    data: updateData,
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
    data: { status },
  });
};

export const userService = {
  getMyProfileFromDB,
  updateProfileInDB,
  getAllUsersFromDB,
  updateUserStatusInDB,
};

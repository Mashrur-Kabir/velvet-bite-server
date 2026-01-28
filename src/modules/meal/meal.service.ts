import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { Meal } from "../../../generated/prisma/client";

interface IMealFilter {
  search?: string | undefined;
  categoryId?: string | undefined;
  providerId?: string | undefined;
  isAvailable?: boolean | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}

const createMealInDB = async (
  data: Omit<Meal, "id" | "createdAt" | "updatedAt" | "providerId">,
  userId: string,
) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!provider) {
    throw new AppError(403, "You are not a provider");
  }

  return prisma.meal.create({
    data: {
      ...data,
      providerId: provider.id,
    },
  });
};

const getAllMealsFromDB = async (payload: IMealFilter) => {
  const {
    search,
    categoryId,
    providerId,
    isAvailable,
    limit,
    skip,
    sortBy,
    sortOrder,
  } = payload;

  const whereConditions: any = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(categoryId && { categoryId }),
    ...(providerId && { providerId }),
    ...(isAvailable !== undefined && { isAvailable }),
  };

  const [data, total] = await Promise.all([
    prisma.meal.findMany({
      where: whereConditions,
      include: {
        category: { select: { name: true } },
        provider: { select: { name: true } },
        // returns the number of reviews for each meal
        _count: {
          select: { reviews: true },
        },
        reviews: {
          where: { isHidden: false },
          select: { rating: true },
        },
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.meal.count({ where: whereConditions }),
  ]);

  // Transforming data to include a simple rating summary
  const mealsWithRatings = data.map((meal) => {
    const totalReviews = meal.reviews.length;
    const avgRating = totalReviews
      ? meal.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews
      : 0;

    return {
      ...meal,
      avgRating: Number(avgRating.toFixed(1)),
      totalReviews,
      reviews: undefined, // hide the raw review array to keep the list response clean
    };
  });

  return { data: mealsWithRatings, total };
};

const getMealByIdFromDB = async (mealId: string) => {
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    include: {
      category: true,
      provider: true,
      reviews: {
        where: { isHidden: false },
        orderBy: {
          createdAt: "desc", // Latest reviews first
        },
        include: {
          user: {
            select: {
              name: true,
              image: true, // Show customer profile picture
            },
          },
        },
      },
    },
  });

  if (!meal) throw new AppError(404, "Meal not found");

  return meal;
};

const getMealsByProviderFromDB = async (userId: string) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!provider) throw new AppError(403, "You are not a provider");

  return prisma.meal.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: "desc" },
  });
};

const updateMealInDB = async (
  mealId: string,
  userId: string,
  payload: Partial<Meal>,
) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!provider) throw new AppError(403, "You are not a provider");

  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
  });

  if (!meal) throw new AppError(404, "Meal not found");
  if (meal.providerId !== provider.id) {
    throw new AppError(403, "You are not authorized to update this meal");
  }

  delete (payload as any).id;
  delete (payload as any).providerId;
  delete (payload as any).createdAt;
  delete (payload as any).updatedAt;

  return prisma.meal.update({
    where: { id: mealId },
    data: payload,
  });
};

const deleteMealInDB = async (mealId: string, userId: string) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!provider) throw new AppError(403, "You are not a provider");

  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
  });

  if (!meal) throw new AppError(404, "Meal not found");
  if (meal.providerId !== provider.id) {
    throw new AppError(403, "You are not authorized to delete this meal");
  }

  return prisma.meal.delete({
    where: { id: mealId },
  });
};

export const mealService = {
  createMealInDB,
  getAllMealsFromDB,
  getMealByIdFromDB,
  getMealsByProviderFromDB,
  updateMealInDB,
  deleteMealInDB,
};

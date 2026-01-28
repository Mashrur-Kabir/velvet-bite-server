import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";

interface ICreateReviewPayload {
  mealId: string;
  rating: number;
  comment?: string;
}

const createReviewInDB = async (
  userId: string,
  payload: ICreateReviewPayload,
) => {
  const { mealId, rating, comment } = payload;

  if (rating < 1 || rating > 5) {
    throw new AppError(400, "Rating must be between 1 and 5");
  }

  // 1️ Check meal exists
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
  });

  if (!meal) throw new AppError(404, "Meal not found");

  // 2️ Check user ordered this meal
  const hasOrdered = await prisma.orderItem.findFirst({
    where: {
      mealId,
      order: {
        customerId: userId,
        status: "DELIVERED",
      },
    },
  });

  if (!hasOrdered) {
    throw new AppError(403, "You can only review meals you have ordered");
  }

  // 3️ Create review
  try {
    return await prisma.review.create({
      data: {
        mealId,
        userId,
        rating,
        // Only include comment if it's not undefined to satisfy exactOptionalPropertyTypes
        ...(comment !== undefined && { comment }),
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new AppError(409, "You already reviewed this meal");
    }
    throw error;
  }
};

const getReviewsByMealFromDB = async (mealId: string) => {
  return prisma.review.findMany({
    where: { mealId },
    orderBy: { createdAt: "desc" },
  });
};

const deleteReviewInDB = async (
  reviewId: string,
  userId: string,
  isAdmin: boolean,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) throw new AppError(404, "Review not found");

  if (!isAdmin && review.userId !== userId) {
    throw new AppError(403, "You are not authorized to delete this review");
  }

  return prisma.review.delete({
    where: { id: reviewId },
  });
};

export const reviewService = {
  createReviewInDB,
  getReviewsByMealFromDB,
  deleteReviewInDB,
};

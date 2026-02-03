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

  // check meal exists
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
  });

  if (!meal) throw new AppError(404, "Meal not found");

  // check user ordered this meal and it was DELIVERED
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
    throw new AppError(
      403,
      "You can only review meals you have ordered and received",
    );
  }

  // create review with a unique check
  try {
    return await prisma.review.create({
      data: {
        mealId,
        userId,
        rating,
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

const getMyReviewsFromDB = async (userId: string) => {
  return prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      meal: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
    },
  });
};

const getReviewsByMealFromDB = async (mealId: string) => {
  return prisma.review.findMany({
    where: { mealId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};

// cew Service for Admin Moderation
const getAllReviewsFromDB = async () => {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      meal: { select: { name: true } },
    },
  });
};

const toggleReviewVisibilityInDB = async (
  reviewId: string,
  isHidden: boolean,
) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError(404, "Review not found");

  return prisma.review.update({
    where: { id: reviewId },
    data: { isHidden },
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

  // Admin can delete any; Customer can only delete their own
  if (!isAdmin && review.userId !== userId) {
    throw new AppError(403, "You are not authorized to delete this review");
  }

  return prisma.review.delete({
    where: { id: reviewId },
  });
};

export const reviewService = {
  createReviewInDB,
  getMyReviewsFromDB,
  getReviewsByMealFromDB,
  getAllReviewsFromDB,
  toggleReviewVisibilityInDB,
  deleteReviewInDB,
};

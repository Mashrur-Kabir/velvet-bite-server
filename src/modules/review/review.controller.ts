import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");

  const result = await reviewService.createReviewInDB(user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review submitted successfully",
    data: result,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");

  const result = await reviewService.getMyReviewsFromDB(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your personal reflections fetched successfully",
    data: result,
  });
});

const getReviewsByMeal = catchAsync(async (req: Request, res: Response) => {
  const { mealId } = req.params;
  if (!mealId) throw new AppError(400, "Meal ID is required");

  const result = await reviewService.getReviewsByMealFromDB(mealId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.length
      ? "Reviews fetched successfully"
      : "No reviews found",
    data: result,
  });
});

// New Controller for Admin
const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getAllReviewsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All platform reviews fetched for moderation",
    data: result,
  });
});

const toggleReviewVisibility = catchAsync(
  async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const { isHidden } = req.body; // Expecting boolean

    const result = await reviewService.toggleReviewVisibilityInDB(
      reviewId as string,
      isHidden,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Review is now ${isHidden ? "hidden" : "visible"}`,
      data: result,
    });
  },
);

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const user = req.user;

  if (!user) throw new AppError(401, "You are unauthorized");
  if (!reviewId) throw new AppError(400, "Review ID is required");

  const result = await reviewService.deleteReviewInDB(
    reviewId as string,
    user.id,
    user.role === "ADMIN",
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getMyReviews,
  getReviewsByMeal,
  getAllReviews,
  toggleReviewVisibility,
  deleteReview,
};

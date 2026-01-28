import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";
import { mealService } from "./meal.service";
import { calculatePagination } from "../../helpers/queryHelpers";
import { getStringQuery, parseBooleanQuery } from "../../utils/parseQuery";

const createMeal = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");

  const result = await mealService.createMealInDB(req.body, user.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Meal created successfully",
    data: result,
  });
});

const getAllMeals = catchAsync(async (req: Request, res: Response) => {
  // filters
  const search = getStringQuery(req.query.search);
  const categoryId = getStringQuery(req.query.categoryId);
  const providerId = getStringQuery(req.query.providerId);
  const isAvailable = parseBooleanQuery(req.query.isAvailable);

  // pagination
  const paginationOptions = calculatePagination({
    page: Number(req.query.page),
    limit: Number(req.query.limit),
    sortBy: getStringQuery(req.query.sortBy),
    sortOrder: getStringQuery(req.query.sortOrder),
  });

  const { data, total } = await mealService.getAllMealsFromDB({
    search,
    categoryId,
    providerId,
    isAvailable,
    ...paginationOptions,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: data.length ? "Meals fetched successfully" : "No meals found",
    meta: {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      total,
      totalPages: Math.ceil(total / paginationOptions.limit),
    },
    data,
  });
});

const getMealById = catchAsync(async (req: Request, res: Response) => {
  const { mealId } = req.params;
  if (!mealId) throw new AppError(400, "Meal ID is required");

  const result = await mealService.getMealByIdFromDB(mealId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Meal fetched successfully",
    data: result,
  });
});

const getMyMeals = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");

  const result = await mealService.getMealsByProviderFromDB(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Meals fetched successfully",
    data: result,
  });
});

const updateMeal = catchAsync(async (req: Request, res: Response) => {
  const { mealId } = req.params;
  const user = req.user;

  if (!user) throw new AppError(401, "You are unauthorized");
  if (!mealId) throw new AppError(400, "Meal ID is required");

  const result = await mealService.updateMealInDB(
    mealId as string,
    user.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Meal updated successfully",
    data: result,
  });
});

const deleteMeal = catchAsync(async (req: Request, res: Response) => {
  const { mealId } = req.params;
  const user = req.user;

  if (!user) throw new AppError(401, "You are unauthorized");
  if (!mealId) throw new AppError(400, "Meal ID is required");

  const result = await mealService.deleteMealInDB(mealId as string, user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Meal deleted successfully",
    data: result,
  });
});

export const mealController = {
  createMeal,
  getAllMeals,
  getMealById,
  getMyMeals,
  updateMeal,
  deleteMeal,
};

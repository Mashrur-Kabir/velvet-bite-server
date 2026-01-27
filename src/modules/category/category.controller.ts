import { Request, Response } from "express";
import { categoryService } from "./category.service";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    throw new AppError(400, "Category name is required");
  }

  const result = await categoryService.createCategoryInDB(name);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
  const result = await categoryService.getAllCategoriesFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message:
      result.length > 0
        ? "Categories fetched successfully"
        : "No categories found",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { name, isActive } = req.body;

  if (!categoryId) {
    throw new AppError(400, "Category ID is required");
  }

  const result = await categoryService.updateCategoryInDB(
    categoryId as string,
    { name, isActive },
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
};

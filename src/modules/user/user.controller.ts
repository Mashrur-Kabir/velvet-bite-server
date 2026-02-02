import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { AppError } from "../../errors/AppError";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const result = await userService.getMyProfileFromDB(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile fetched successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const result = await userService.updateProfileInDB(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Culinary identity updated successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

const changeStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status } = req.body;

  const result = await userService.updateUserStatusInDB(
    userId as string,
    status,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `User status changed to ${status}`,
    data: result,
  });
});

export const userController = {
  getMyProfile,
  updateProfile,
  getAllUsers,
  changeStatus,
};

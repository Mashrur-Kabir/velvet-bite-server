import { Request, Response } from "express";
import { providerService } from "./provider.service";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";

const createProvider = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");

  const result = await providerService.createProviderInDB(user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Provider profile created successfully",
    data: result,
  });
});

const getMyProvider = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");

  const result = await providerService.getMyProviderFromDB(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Provider profile fetched successfully",
    data: result,
  });
});

const updateMyProvider = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");

  const result = await providerService.updateMyProviderInDB(user.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Provider profile updated successfully",
    data: result,
  });
});

const getProviderById = catchAsync(async (req: Request, res: Response) => {
  const { providerId } = req.params;

  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }

  const result = await providerService.getProviderByIdFromDB(
    providerId as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Provider fetched successfully",
    data: result,
  });
});

const getAllProviders = catchAsync(async (_req: Request, res: Response) => {
  const result = await providerService.getAllProvidersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message:
      result.length > 0
        ? "Providers fetched successfully"
        : "No providers found",
    data: result,
  });
});

export const providerController = {
  createProvider,
  getMyProvider,
  updateMyProvider,
  getProviderById,
  getAllProviders,
};

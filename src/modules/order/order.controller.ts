import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../errors/AppError";
import { orderService } from "./order.service";
import sendResponse from "../../utils/sendResponse";
import { OrderStatus } from "../../../generated/prisma/client";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");

  const { items, deliveryAddress } = req.body;

  if (!deliveryAddress) {
    throw new AppError(400, "Delivery address is required");
  }

  const result = await orderService.createOrderInDB(
    user.id,
    items,
    deliveryAddress,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Order placed successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");

  const result = await orderService.getMyOrdersFromDB(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Orders fetched successfully",
    data: result,
  });
});

const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");

  const result = await orderService.getProviderOrdersFromDB(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Incoming orders fetched successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.getAllOrdersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All platform orders fetched successfully",
    data: result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const user = req.user;

  if (!user) throw new AppError(401, "You are unauthorized");

  const result = await orderService.getOrderByIdFromDB(
    orderId as string,
    user.id,
    user.role,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order details fetched successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const user = req.user;

  if (!user) throw new AppError(401, "You are unauthorized");
  if (!orderId) throw new AppError(400, "Order ID is required");

  const result = await orderService.updateOrderStatusInDB(
    orderId as string,
    status as OrderStatus,
    user.id,
    user.role,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Order status updated to ${status}`,
    data: result,
  });
});

export const orderController = {
  createOrder,
  getMyOrders,
  getProviderOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};

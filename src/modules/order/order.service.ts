import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { OrderStatus } from "../../../generated/prisma/client";

const createOrderInDB = async (
  customerId: string,
  items: {
    productId: string;
    quantity: number;
  }[],
  deliveryAddress: string,
) => {
  if (!items || items.length === 0) {
    throw new AppError(400, "Order must contain at least one item");
  }

  // 1. Fetch meals to get prices and provider info
  const products = await prisma.meal.findMany({
    where: {
      id: { in: items.map((i) => i.productId) },
    },
  });

  if (products.length !== items.length) {
    throw new AppError(404, "One or more products not found");
  }

  // 2. Map items to schema structure
  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;

    return {
      quantity: item.quantity,
      price: product.price,
      meal: {
        connect: {
          id: product.id,
        },
      },
    };
  });

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // 3. Get the providerId (Required by your Order model)
  const providerIds = new Set(products.map((p) => p.providerId));

  if (providerIds.size !== 1) {
    throw new AppError(
      400,
      "You can only order meals from one provider at a time",
    );
  }

  const providerId = products[0]?.providerId;

  if (!providerId) {
    throw new AppError(400, "Provider information is missing");
  }

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerId,
        providerId,
        deliveryAddress,
        totalAmount,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  });
};

const getMyOrdersFromDB = async (customerId: string) => {
  return prisma.order.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          meal: true,
        },
      },
    },
  });
};

const updateOrderStatusInDB = async (orderId: string, status: OrderStatus) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new AppError(404, "Order not found");

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

export const orderService = {
  createOrderInDB,
  getMyOrdersFromDB,
  updateOrderStatusInDB,
};

import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { OrderStatus } from "../../../generated/prisma/client";

const createOrderInDB = async (
  customerId: string,
  items: {
    mealId: string;
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
      id: { in: items.map((i) => i.mealId) },
    },
  });

  if (products.length !== items.length) {
    throw new AppError(404, "One or more products not found");
  }

  // 2. Map items to schema structure
  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.mealId)!;

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
      // Instead of including EVERYTHING, select specific fields
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          meal: {
            select: {
              name: true,
              imageUrl: true, // Frontend only needs the name and image
            },
          },
        },
      },
    },
  });
};

const getProviderOrdersFromDB = async (userId: string) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!providerProfile) {
    throw new AppError(404, "Provider profile not found");
  }

  return prisma.order.findMany({
    where: { providerId: providerProfile.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      deliveryAddress: true,
      createdAt: true,
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
      items: {
        select: {
          quantity: true,
          price: true,
          meal: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

const getAllOrdersFromDB = async () => {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true } },
      provider: { select: { name: true } },
    },
  });
};

const getOrderByIdFromDB = async (
  orderId: string,
  userId: string,
  role: string,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { meal: true },
      },
      customer: { select: { name: true, email: true } },
      provider: { select: { name: true } },
    },
  });

  if (!order) throw new AppError(404, "Order not found");

  // SECURITY: Check if user has permission to see this specific order
  const isOwner = order.customerId === userId;
  const isProvider =
    order.providerId ===
    (await prisma.providerProfile.findUnique({ where: { userId } }))?.id;
  const isAdmin = role === "ADMIN";

  if (!isOwner && !isProvider && !isAdmin) {
    throw new AppError(403, "You do not have permission to view this order");
  }

  return order;
};

const updateOrderStatusInDB = async (
  orderId: string,
  newStatus: OrderStatus,
  userId: string,
  role: string,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new AppError(404, "Order not found");

  // 1. CUSTOMER Logic: Can only CANCEL and only if status is PLACED
  if (role === "CUSTOMER") {
    if (newStatus !== "CANCELLED") {
      throw new AppError(403, "Customers can only change status to CANCELLED");
    }
    if (order.status !== "PLACED") {
      throw new AppError(
        400,
        "Cannot cancel order once preparation has started",
      );
    }
    if (order.customerId !== userId) {
      throw new AppError(403, "You can only cancel your own orders");
    }
  }

  // 2. PROVIDER Logic: Must own the restaurant and cannot CANCEL
  if (role === "PROVIDER") {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile || order.providerId !== providerProfile.id) {
      throw new AppError(
        403,
        "You can only update orders for your own restaurant",
      );
    }

    if (newStatus === "CANCELLED") {
      throw new AppError(
        403,
        "Providers cannot cancel orders via this endpoint",
      );
    }
  }

  // 3. ADMIN Logic: Full permissions (as per Admin Features) as they oversee the platform

  return prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });
};

export const orderService = {
  createOrderInDB,
  getMyOrdersFromDB,
  getProviderOrdersFromDB,
  getAllOrdersFromDB,
  getOrderByIdFromDB,
  updateOrderStatusInDB,
};

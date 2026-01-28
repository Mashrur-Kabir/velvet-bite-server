import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { Category } from "../../../generated/prisma/client";

const createCategoryInDB = async (name: string) => {
  const existing = await prisma.category.findUnique({
    where: { name },
  });

  if (existing) {
    throw new AppError(409, "Category already exists");
  }

  return prisma.category.create({
    data: { name },
  });
};

const getAllCategoriesFromDB = async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });
};

const updateCategoryInDB = async (
  categoryId: string,
  payload: Partial<Category>,
) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  // Protect system fields
  delete (payload as any).id;
  delete (payload as any).createdAt;
  delete (payload as any).updatedAt;

  return prisma.category.update({
    where: { id: categoryId },
    data: payload,
  });
};

export const categoryService = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
};

import { Router } from "express";
import auth from "../../middlewares/authMiddleware";
import { categoryController } from "./category.controller";
import { USER_ROLE } from "../../types/user";

const router = Router();

// public
router.get("/", categoryController.getAllCategories);

// admin-only
router.post("/", auth(USER_ROLE.ADMIN), categoryController.createCategory);

router.patch(
  "/:categoryId",
  auth(USER_ROLE.ADMIN),
  categoryController.updateCategory,
);

export const categoryRoutes = router;

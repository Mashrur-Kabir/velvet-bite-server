import { Router } from "express";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";
import { USER_ROLE } from "../../types/user";

const router = Router();

// Customer/Provider/Admin: Get own profile
router.get(
  "/me",
  auth(USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER, USER_ROLE.ADMIN),
  userController.getMyProfile,
);

// Update profile
router.patch(
  "/update-me",
  auth(USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER, USER_ROLE.ADMIN),
  userController.updateProfile,
);

// Admin only: Management
router.get("/", auth(USER_ROLE.ADMIN), userController.getAllUsers);

router.patch(
  "/:userId/status",
  auth(USER_ROLE.ADMIN),
  userController.changeStatus,
);

export const userRoutes = router;

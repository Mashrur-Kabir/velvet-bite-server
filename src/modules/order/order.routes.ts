import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../types/user";
import { orderController } from "./order.controller";

const router = Router();

router.post("/", auth(USER_ROLE.CUSTOMER), orderController.createOrder);

router.get("/my-orders", auth(USER_ROLE.CUSTOMER), orderController.getMyOrders);

router.get(
  "/provider-orders",
  auth(USER_ROLE.PROVIDER),
  orderController.getProviderOrders,
);

// GET all orders (Admin only - Requirement: "View all orders")
router.get("/", auth(USER_ROLE.ADMIN), orderController.getAllOrders);

// GET specific order details (Admin, Customer, or Provider)
router.get(
  "/:orderId",
  auth(USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER),
  orderController.getOrderById,
);

router.patch(
  "/:orderId/status",
  auth(USER_ROLE.ADMIN, USER_ROLE.PROVIDER, USER_ROLE.CUSTOMER),
  orderController.updateOrderStatus,
);

export const orderRoutes = router;

//all testing done

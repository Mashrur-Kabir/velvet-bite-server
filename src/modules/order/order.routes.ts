import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types/user";
import { orderController } from "./order.controller";

const router = Router();

router.post("/", auth(USER_ROLE.CUSTOMER), orderController.createOrder);

router.get("/my-orders", auth(USER_ROLE.CUSTOMER), orderController.getMyOrders);

router.patch(
  "/:orderId/status",
  auth(USER_ROLE.ADMIN),
  orderController.updateOrderStatus,
);

export const orderRoutes = router;

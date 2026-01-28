import { Router } from "express";
import auth from "../../middlewares/auth";
import { reviewController } from "./review.controller";
import { USER_ROLE } from "../../types/user";

const router = Router();

router.post("/", auth(USER_ROLE.CUSTOMER), reviewController.createReview);

router.get("/meal/:mealId", reviewController.getReviewsByMeal);

router.delete(
  "/:reviewId",
  auth(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN),
  reviewController.deleteReview,
);

export const reviewRoutes = router;

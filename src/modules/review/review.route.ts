import { Router } from "express";
import auth from "../../middlewares/auth";
import { reviewController } from "./review.controller";
import { USER_ROLE } from "../../types/user";

const router = Router();

router.post("/", auth(USER_ROLE.CUSTOMER), reviewController.createReview);

router.get(
  "/my-reviews",
  auth(USER_ROLE.CUSTOMER),
  reviewController.getMyReviews,
);

// Add this for Admin overview
router.get("/", auth(USER_ROLE.ADMIN), reviewController.getAllReviews);

router.get("/meal/:mealId", reviewController.getReviewsByMeal);

// Admin moderation: Toggle visibility
router.patch(
  "/:reviewId/visibility",
  auth(USER_ROLE.ADMIN),
  reviewController.toggleReviewVisibility,
);

router.delete(
  "/:reviewId",
  auth(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN),
  reviewController.deleteReview,
);

export const reviewRoutes = router;

import { Router } from "express";
import auth from "../../middlewares/authMiddleware";
import { mealController } from "./meal.controller";
import { USER_ROLE } from "../../types/user";

const router = Router();

/**
 * PROVIDER routes
 */
router.post("/", auth(USER_ROLE.PROVIDER), mealController.createMeal);

router.get("/my-meals", auth(USER_ROLE.PROVIDER), mealController.getMyMeals);

router.patch("/:mealId", auth(USER_ROLE.PROVIDER), mealController.updateMeal);

router.delete("/:mealId", auth(USER_ROLE.PROVIDER), mealController.deleteMeal);

/**
 * PUBLIC routes
 */
router.get("/", mealController.getAllMeals);
router.get("/:mealId", mealController.getMealById);

export const mealRoutes = router;

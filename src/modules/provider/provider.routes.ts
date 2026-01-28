import { Router } from "express";
import auth from "../../middlewares/auth";
import { providerController } from "./provider.controller";
import { USER_ROLE } from "../../types/user";

const router = Router();

// create provider profile
router.post("/", auth(USER_ROLE.PROVIDER), providerController.createProvider);

// get my provider profile
router.get("/me", auth(USER_ROLE.PROVIDER), providerController.getMyProvider);

// update my provider profile
router.patch(
  "/me",
  auth(USER_ROLE.PROVIDER),
  providerController.updateMyProvider,
);

// public routes
router.get("/", providerController.getAllProviders);
router.get("/:providerId", providerController.getProviderById);

export const providerRoutes = router;

//all testing done.

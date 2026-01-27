import { Router } from "express";
import auth from "../../middlewares/auth";
import { providerController } from "./provider.controller";

const router = Router();

// create provider profile
router.post("/", auth(), providerController.createProvider);

// get my provider profile
router.get("/me", auth(), providerController.getMyProvider);

// update my provider profile
router.patch("/me", auth(), providerController.updateMyProvider);

// public routes
router.get("/", providerController.getAllProviders);
router.get("/:providerId", providerController.getProviderById);

export const providerRoutes = router;

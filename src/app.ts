import express, { Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/better-auth";
import { reviewRoutes } from "./modules/review/review.route";
import { mealRoutes } from "./modules/meal/meal.route";
import { categoryRoutes } from "./modules/category/category.route";
import { providerRoutes } from "./modules/provider/provider.routes";
import { orderRoutes } from "./modules/order/order.routes";

const app: Application = express();

//cors middleware
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

//express
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello! This is the Velvet Bites server! :)");
});

//business routes:-------

//auth:
app.all("/api/auth/*splat", toNodeHandler(auth));

//reviews:
app.use("/api/reviews", reviewRoutes);

//meals:
app.use("/api/meals", mealRoutes);

//categories:
app.use("/api/categories", categoryRoutes);

//providers:
app.use("/api/providers", providerRoutes);

//orders:
app.use("/api/orders", orderRoutes);

export default app;

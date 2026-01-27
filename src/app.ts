import express, { Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/better-auth";

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

export default app;

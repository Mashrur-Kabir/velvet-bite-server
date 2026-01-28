import { prisma } from "../lib/prisma";
import { USER_ROLE } from "../types/user";
import { logger } from "../utils/logger";
import dotenv from "dotenv";

dotenv.config();

async function seedAdmin() {
  try {
    logger.info("Starting admin seeding process...");

    const adminData = {
      name: process.env.ADMIN_NAME!,
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
    };

    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingUser) {
      logger.success("Admin already exists. Skipping creation.");
      return;
    }

    // Ensure /api/auth is included in the path
    const authUrl = `${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`;

    // Better-Auth expects the Origin to be a trusted one (usually your frontend)
    const origin = process.env.APP_URL || "http://localhost:3000";

    const signUpResponse = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify(adminData),
    });

    // Defensive Check: Don't parse JSON if the server sent HTML (404/500)
    const contentType = signUpResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await signUpResponse.text();
      logger.error(
        `Server returned HTML instead of JSON (Status: ${signUpResponse.status}). Check if your URL path is correct.`,
      );
      return;
    }

    const result = await signUpResponse.json();

    if (signUpResponse.ok) {
      await prisma.user.update({
        where: { email: adminData.email },
        data: {
          role: USER_ROLE.ADMIN,
          emailVerified: true,
          status: "ACTIVE",
        },
      });
      logger.success("Admin seeded and verified successfully.");
    } else {
      logger.error(`Sign-up failed: ${result.message || "Unknown error"}`);
    }
  } catch (err) {
    logger.error("A critical error occurred during seeding", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();

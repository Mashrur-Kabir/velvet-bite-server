import { AppError } from "../errors/AppError";
import { prisma } from "../lib/prisma";
import dotenv from "dotenv";
import { USER_ROLE } from "../types/user";

dotenv.config();

async function seedAdmin() {
  try {
    console.log("🚀 Admin seeding started...");

    const adminData = {
      name: process.env.ADMIN_NAME as string,
      email: process.env.ADMIN_EMAIL as string,
      password: process.env.ADMIN_PASSWORD as string,
    };

    // 1. Check if user already exists to avoid duplicates
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingUser) {
      throw new AppError(409, "Admin already exists in the database.");
    }

    // 2. Call the API to create the user via Better Auth
    // This ensures Better Auth handles the hashing and Account table creation
    const signUpResponse = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: process.env.SERVER_URL || "http://localhost:5000",
        },
        body: JSON.stringify(adminData),
      },
    );

    const result = await signUpResponse.json();
    console.log("📦 Auth API Response:", result);

    // 3. Elevate user to ADMIN and verify email
    if (signUpResponse.ok) {
      console.log("🪄 Elevating user to ADMIN status...");
      await prisma.user.update({
        where: { email: adminData.email },
        data: {
          role: USER_ROLE.ADMIN,
          emailVerified: true,
          status: "ACTIVE",
        },
      });
      console.log("🟢 Admin seeded and verified successfully!");
    } else {
      console.error("🔴 Sign-up failed:", result.message);
    }
  } catch (err) {
    console.error("🔴 Seeding Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();

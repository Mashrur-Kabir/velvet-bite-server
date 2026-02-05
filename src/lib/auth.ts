import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import { verificationEmailTemplate } from "../helpers/verificationEmail";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000/api/auth",

  trustedOrigins: [process.env.APP_URL!],

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // 1. Force ADMIN to CUSTOMER
          // 2. a null/undefined role becomes CUSTOMER
          let finalRole = user.role;

          if (!finalRole || finalRole === "ADMIN") {
            finalRole = "CUSTOMER";
          }

          return {
            data: {
              ...user,
              role: finalRole,
              emailVerified: true,
            },
          };
        },
      },
    },
  },

  advanced: {
    cookie: {
      domain: ".vercel.app", // This allows sharing across all *.vercel.app subdomains
    },
    // Required for secure cookie transmission in production
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requiredEmailVerification: false,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationURL = `${process.env.APP_URL}/verify-email?token=${token}`;

      await transporter.sendMail({
        from: `"Velvet Bites" <${process.env.APP_USER}>`,
        to: user.email,
        subject: "Verify your email",
        html: verificationEmailTemplate(verificationURL, user.name),
      });
    },
  },

  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

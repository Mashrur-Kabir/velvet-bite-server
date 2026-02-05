var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String           @id\n  name          String\n  email         String\n  emailVerified Boolean          @default(false)\n  image         String?\n  createdAt     DateTime         @default(now())\n  updatedAt     DateTime         @updatedAt\n  role          String?\n  phone         String?\n  status        UserStatus?      @default(ACTIVE) // Enum type\n  provider      ProviderProfile?\n\n  sessions Session[]\n  accounts Account[]\n  orders   Order[]\n  reviews  Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  PENDING\n}\n\n/// =======================\n/// CATEGORY\n/// =======================\n\nmodel Category {\n  id       String  @id @default(uuid())\n  name     String  @unique\n  isActive Boolean @default(true)\n\n  meals Meal[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\n/// =======================\n/// MEAL\n/// =======================\n\nmodel Meal {\n  id         String @id @default(uuid())\n  providerId String\n  categoryId String\n\n  name        String\n  description String?\n  price       Float\n  imageUrl    String?\n  isAvailable Boolean @default(true)\n\n  provider ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  category Category        @relation(fields: [categoryId], references: [id])\n\n  orderItems OrderItem[]\n  reviews    Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([providerId])\n  @@index([categoryId])\n}\n\n/// =======================\n/// ORDER\n/// =======================\n\nmodel Order {\n  id         String      @id @default(uuid())\n  customerId String\n  providerId String\n  status     OrderStatus @default(PLACED)\n\n  deliveryAddress String\n  totalAmount     Float\n\n  provider ProviderProfile @relation(fields: [providerId], references: [id])\n  customer User            @relation(fields: [customerId], references: [id])\n  items    OrderItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([customerId])\n  @@index([providerId])\n}\n\n/// =======================\n/// ORDER ITEM (JOIN TABLE)\n/// =======================\n\nmodel OrderItem {\n  id      String @id @default(uuid())\n  orderId String\n  mealId  String\n\n  quantity Int\n  price    Float\n\n  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal  Meal  @relation(fields: [mealId], references: [id])\n\n  @@index([orderId])\n  @@index([mealId])\n}\n\nenum OrderStatus {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n\n/// =======================\n/// PROVIDER PROFILE\n/// =======================\n\nmodel ProviderProfile {\n  id          String  @id @default(uuid())\n  userId      String  @unique //enforces a One-to-One relationship between a User and their ProviderProfile.\n  name        String\n  description String?\n  address     String\n  phone       String\n  isActive    Boolean @default(true)\n  user        User    @relation(fields: [userId], references: [id])\n\n  meals  Meal[]\n  orders Order[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\n/// =======================\n/// REVIEW\n/// =======================\n\nmodel Review {\n  id     String @id @default(uuid())\n  mealId String\n  userId String\n\n  rating   Int\n  comment  String?\n  isHidden Boolean @default(false)\n\n  user User @relation(fields: [userId], references: [id])\n  meal Meal @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n\n  @@unique([mealId, userId])\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"customer","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"}],"dbName":null},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"isHidden","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProviderProfileScalarFieldEnum: () => ProviderProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Category: "Category",
  Meal: "Meal",
  Order: "Order",
  OrderItem: "OrderItem",
  ProviderProfile: "ProviderProfile",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MealScalarFieldEnum = {
  id: "id",
  providerId: "providerId",
  categoryId: "categoryId",
  name: "name",
  description: "description",
  price: "price",
  imageUrl: "imageUrl",
  isAvailable: "isAvailable",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  providerId: "providerId",
  status: "status",
  deliveryAddress: "deliveryAddress",
  totalAmount: "totalAmount",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  mealId: "mealId",
  quantity: "quantity",
  price: "price"
};
var ProviderProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  name: "name",
  description: "description",
  address: "address",
  phone: "phone",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  mealId: "mealId",
  userId: "userId",
  rating: "rating",
  comment: "comment",
  isHidden: "isHidden",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = process.env.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";

// src/helpers/verificationEmail.ts
function verificationEmailTemplate(verificationURL, userName) {
  return `
  <div style="margin:0;padding:0;background:#0b1020;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:48px 16px;">
          <table width="100%" max-width="560px" cellpadding="0" cellspacing="0"
            style="
              background:#0f172a;
              border-radius:14px;
              box-shadow:0 20px 50px rgba(79,70,229,0.25);
              overflow:hidden;
            ">

            <!-- Header -->
            <tr>
              <td style="
                padding:32px;
                background:linear-gradient(135deg, #1e3a8a, #6d28d9);
                color:#ffffff;
              ">
                <h1 style="
                  margin:0;
                  font-size:22px;
                  font-weight:700;
                  letter-spacing:0.5px;
                ">
                  Velvet Bite
                </h1>
                <p style="
                  margin:6px 0 0;
                  font-size:13px;
                  opacity:0.85;
                ">
                  Secure \u2022 Modern \u2022 Developer-first
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px;">
                <h2 style="
                  margin:0 0 14px;
                  font-size:24px;
                  color:#e5e7eb;
                ">
                  Verify your email
                </h2>

                <p style="
                  margin:0 0 24px;
                  font-size:15px;
                  color:#c7d2fe;
                  line-height:1.7;
                ">
                  Hello <strong style="color:#ffffff;">${userName}</strong>,
                  <br /><br />
                  Thanks for joining <strong>Velvet Bite</strong> \u{1F389}  
                  Please verify your email address to activate your account and get started.
                </p>

                <!-- Button -->
                <div style="text-align:center;margin:36px 0;">
                  <a href="${verificationURL}"
                    style="
                      display:inline-block;
                      padding:15px 34px;
                      background:linear-gradient(135deg, #4f46e5, #9333ea);
                      color:#ffffff;
                      text-decoration:none;
                      font-weight:700;
                      border-radius:999px;
                      font-size:15px;
                      letter-spacing:0.3px;
                      box-shadow:0 10px 30px rgba(147,51,234,0.45);
                    ">
                    Verify Email \u2192
                  </a>
                </div>

                <!-- Fallback link -->
                <p style="
                  margin:0;
                  font-size:13px;
                  color:#9ca3af;
                  line-height:1.6;
                ">
                  If the button doesn\u2019t work, click the link below or copy-paste it into your browser:
                </p>

                <p style="
                  margin:10px 0 0;
                  font-size:13px;
                  word-break:break-all;
                  color:#a5b4fc;
                ">
                  ${verificationURL}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="
                padding:22px 32px;
                background:#020617;
                font-size:12px;
                color:#6b7280;
                text-align:center;
              ">
                If you didn\u2019t create an account, you can safely ignore this email.
                <br /><br />
                \xA9 2025 Velvet Bite. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
}

// src/lib/auth.ts
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000/api/auth",
  trustedOrigins: [process.env.APP_URL],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          let finalRole = user.role;
          if (!finalRole || finalRole === "ADMIN") {
            finalRole = "CUSTOMER";
          }
          return {
            data: {
              ...user,
              role: finalRole,
              emailVerified: true
            }
          };
        }
      }
    }
  },
  advanced: {
    cookie: {
      domain: ".vercel.app"
      // This allows sharing across all *.vercel.app subdomains
    },
    // Required for secure cookie transmission in production
    useSecureCookies: process.env.NODE_ENV === "production"
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
        input: true
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE"
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requiredEmailVerification: false
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
        html: verificationEmailTemplate(verificationURL, user.name)
      });
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/modules/review/review.route.ts
import { Router } from "express";

// src/middlewares/authMiddleware.ts
import { fromNodeHeaders } from "better-auth/node";

// src/errors/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

// src/middlewares/authMiddleware.ts
var auth2 = (...roles) => {
  return catchAsync(
    async (req, _res, next) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
      });
      if (!session) {
        throw new AppError(401, "You are unauthorized");
      }
      if (!session.user.emailVerified) {
        throw new AppError(
          403,
          "Your email is not verified. Please verify your email first."
        );
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified,
        status: session.user.status
      };
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        throw new AppError(
          403,
          "Forbidden! You do not have permission to access this resource."
        );
      }
      next();
    }
  );
};
var authMiddleware_default = auth2;

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || "Operation Was Successful",
    meta: data.meta,
    data: data.data
  });
};
var sendResponse_default = sendResponse;

// src/modules/review/review.service.ts
var createReviewInDB = async (userId, payload) => {
  const { mealId, rating, comment } = payload;
  if (rating < 1 || rating > 5) {
    throw new AppError(400, "Rating must be between 1 and 5");
  }
  const meal = await prisma.meal.findUnique({
    where: { id: mealId }
  });
  if (!meal) throw new AppError(404, "Meal not found");
  const hasOrdered = await prisma.orderItem.findFirst({
    where: {
      mealId,
      order: {
        customerId: userId,
        status: "DELIVERED"
      }
    }
  });
  if (!hasOrdered) {
    throw new AppError(
      403,
      "You can only review meals you have ordered and received"
    );
  }
  try {
    return await prisma.review.create({
      data: {
        mealId,
        userId,
        rating,
        ...comment !== void 0 && { comment }
      }
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new AppError(409, "You already reviewed this meal");
    }
    throw error;
  }
};
var getMyReviewsFromDB = async (userId) => {
  return prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      meal: {
        select: {
          name: true,
          imageUrl: true
        }
      }
    }
  });
};
var getReviewsByMealFromDB = async (mealId) => {
  return prisma.review.findMany({
    where: { mealId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    }
  });
};
var getAllReviewsFromDB = async () => {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      meal: { select: { name: true } }
    }
  });
};
var toggleReviewVisibilityInDB = async (reviewId, isHidden) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError(404, "Review not found");
  return prisma.review.update({
    where: { id: reviewId },
    data: { isHidden }
  });
};
var deleteReviewInDB = async (reviewId, userId, isAdmin) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review) throw new AppError(404, "Review not found");
  if (!isAdmin && review.userId !== userId) {
    throw new AppError(403, "You are not authorized to delete this review");
  }
  return prisma.review.delete({
    where: { id: reviewId }
  });
};
var reviewService = {
  createReviewInDB,
  getMyReviewsFromDB,
  getReviewsByMealFromDB,
  getAllReviewsFromDB,
  toggleReviewVisibilityInDB,
  deleteReviewInDB
};

// src/modules/review/review.controller.ts
var createReview = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  const result = await reviewService.createReviewInDB(user.id, req.body);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Review submitted successfully",
    data: result
  });
});
var getMyReviews = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  const result = await reviewService.getMyReviewsFromDB(user.id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Your personal reflections fetched successfully",
    data: result
  });
});
var getReviewsByMeal = catchAsync(async (req, res) => {
  const { mealId } = req.params;
  if (!mealId) throw new AppError(400, "Meal ID is required");
  const result = await reviewService.getReviewsByMealFromDB(mealId);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: result.length ? "Reviews fetched successfully" : "No reviews found",
    data: result
  });
});
var getAllReviews = catchAsync(async (req, res) => {
  const result = await reviewService.getAllReviewsFromDB();
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "All platform reviews fetched for moderation",
    data: result
  });
});
var toggleReviewVisibility = catchAsync(
  async (req, res) => {
    const { reviewId } = req.params;
    const { isHidden } = req.body;
    const result = await reviewService.toggleReviewVisibilityInDB(
      reviewId,
      isHidden
    );
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: `Review is now ${isHidden ? "hidden" : "visible"}`,
      data: result
    });
  }
);
var deleteReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  if (!reviewId) throw new AppError(400, "Review ID is required");
  const result = await reviewService.deleteReviewInDB(
    reviewId,
    user.id,
    user.role === "ADMIN"
  );
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted successfully",
    data: result
  });
});
var reviewController = {
  createReview,
  getMyReviews,
  getReviewsByMeal,
  getAllReviews,
  toggleReviewVisibility,
  deleteReview
};

// src/types/user.ts
var USER_ROLE = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER"
};

// src/modules/review/review.route.ts
var router = Router();
router.post("/", authMiddleware_default(USER_ROLE.CUSTOMER), reviewController.createReview);
router.get(
  "/my-reviews",
  authMiddleware_default(USER_ROLE.CUSTOMER),
  reviewController.getMyReviews
);
router.get("/", authMiddleware_default(USER_ROLE.ADMIN), reviewController.getAllReviews);
router.get("/meal/:mealId", reviewController.getReviewsByMeal);
router.patch(
  "/:reviewId/visibility",
  authMiddleware_default(USER_ROLE.ADMIN),
  reviewController.toggleReviewVisibility
);
router.delete(
  "/:reviewId",
  authMiddleware_default(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN),
  reviewController.deleteReview
);
var reviewRoutes = router;

// src/modules/meal/meal.route.ts
import { Router as Router2 } from "express";

// src/modules/meal/meal.service.ts
var createMealInDB = async (data, userId) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (!provider) {
    throw new AppError(403, "You are not a provider");
  }
  return prisma.meal.create({
    data: {
      ...data,
      providerId: provider.id
    }
  });
};
var getAllMealsFromDB = async (payload) => {
  const {
    search,
    categoryId,
    providerId,
    isAvailable,
    limit,
    skip,
    sortBy,
    sortOrder
  } = payload;
  const whereConditions = {
    ...search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    },
    ...categoryId && { categoryId },
    ...providerId && { providerId },
    ...isAvailable !== void 0 && { isAvailable }
  };
  const [data, total] = await Promise.all([
    prisma.meal.findMany({
      where: whereConditions,
      include: {
        category: { select: { name: true } },
        provider: { select: { name: true } },
        // returns the number of reviews for each meal
        _count: {
          select: { reviews: true }
        },
        reviews: {
          where: { isHidden: false },
          select: { rating: true }
        }
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.meal.count({ where: whereConditions })
  ]);
  const mealsWithRatings = data.map((meal) => {
    const totalReviews = meal.reviews.length;
    const avgRating = totalReviews ? meal.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews : 0;
    return {
      ...meal,
      avgRating: Number(avgRating.toFixed(1)),
      totalReviews,
      reviews: void 0
      // hide the raw review array to keep the list response clean
    };
  });
  return { data: mealsWithRatings, total };
};
var getMealByIdFromDB = async (mealId) => {
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    include: {
      category: true,
      provider: true,
      reviews: {
        where: { isHidden: false },
        orderBy: {
          createdAt: "desc"
          // Latest reviews first
        },
        include: {
          user: {
            select: {
              name: true,
              image: true
              // Show customer profile picture
            }
          }
        }
      }
    }
  });
  if (!meal) throw new AppError(404, "Meal not found");
  return meal;
};
var getMealsByProviderFromDB = async (userId) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (!provider) throw new AppError(403, "You are not a provider");
  return prisma.meal.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: "desc" }
  });
};
var updateMealInDB = async (mealId, userId, payload) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (!provider) throw new AppError(403, "You are not a provider");
  const meal = await prisma.meal.findUnique({
    where: { id: mealId }
  });
  if (!meal) throw new AppError(404, "Meal not found");
  if (meal.providerId !== provider.id) {
    throw new AppError(403, "You are not authorized to update this meal");
  }
  delete payload.id;
  delete payload.providerId;
  delete payload.createdAt;
  delete payload.updatedAt;
  return prisma.meal.update({
    where: { id: mealId },
    data: payload
  });
};
var deleteMealInDB = async (mealId, userId) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (!provider) throw new AppError(403, "You are not a provider");
  const meal = await prisma.meal.findUnique({
    where: { id: mealId }
  });
  if (!meal) throw new AppError(404, "Meal not found");
  if (meal.providerId !== provider.id) {
    throw new AppError(403, "You are not authorized to delete this meal");
  }
  return prisma.meal.delete({
    where: { id: mealId }
  });
};
var mealService = {
  createMealInDB,
  getAllMealsFromDB,
  getMealByIdFromDB,
  getMealsByProviderFromDB,
  updateMealInDB,
  deleteMealInDB
};

// src/helpers/queryHelpers.ts
var calculatePagination = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};

// src/utils/parseQuery.ts
var getStringQuery = (param) => {
  return typeof param === "string" ? param : void 0;
};
var parseBooleanQuery = (value) => {
  const strValue = typeof value === "string" ? value : void 0;
  if (strValue === "true") return true;
  if (strValue === "false") return false;
  return void 0;
};

// src/modules/meal/meal.controller.ts
var createMeal = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  const result = await mealService.createMealInDB(req.body, user.id);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Meal created successfully",
    data: result
  });
});
var getAllMeals = catchAsync(async (req, res) => {
  const search = getStringQuery(req.query.search);
  const categoryId = getStringQuery(req.query.categoryId);
  const providerId = getStringQuery(req.query.providerId);
  const isAvailable = parseBooleanQuery(req.query.isAvailable);
  const paginationOptions = calculatePagination({
    page: Number(req.query.page),
    limit: Number(req.query.limit),
    sortBy: getStringQuery(req.query.sortBy),
    sortOrder: getStringQuery(req.query.sortOrder)
  });
  const { data, total } = await mealService.getAllMealsFromDB({
    search,
    categoryId,
    providerId,
    isAvailable,
    ...paginationOptions
  });
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: data.length ? "Meals fetched successfully" : "No meals found",
    meta: {
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      total,
      totalPages: Math.ceil(total / paginationOptions.limit)
    },
    data
  });
});
var getMealById = catchAsync(async (req, res) => {
  const { mealId } = req.params;
  if (!mealId) throw new AppError(400, "Meal ID is required");
  const result = await mealService.getMealByIdFromDB(mealId);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Meal fetched successfully",
    data: result
  });
});
var getMyMeals = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  const result = await mealService.getMealsByProviderFromDB(user.id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Meals fetched successfully",
    data: result
  });
});
var updateMeal = catchAsync(async (req, res) => {
  const { mealId } = req.params;
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  if (!mealId) throw new AppError(400, "Meal ID is required");
  const result = await mealService.updateMealInDB(
    mealId,
    user.id,
    req.body
  );
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Meal updated successfully",
    data: result
  });
});
var deleteMeal = catchAsync(async (req, res) => {
  const { mealId } = req.params;
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  if (!mealId) throw new AppError(400, "Meal ID is required");
  const result = await mealService.deleteMealInDB(mealId, user.id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Meal deleted successfully",
    data: result
  });
});
var mealController = {
  createMeal,
  getAllMeals,
  getMealById,
  getMyMeals,
  updateMeal,
  deleteMeal
};

// src/modules/meal/meal.route.ts
var router2 = Router2();
router2.post("/", authMiddleware_default(USER_ROLE.PROVIDER), mealController.createMeal);
router2.get("/my-meals", authMiddleware_default(USER_ROLE.PROVIDER), mealController.getMyMeals);
router2.patch("/:mealId", authMiddleware_default(USER_ROLE.PROVIDER), mealController.updateMeal);
router2.delete("/:mealId", authMiddleware_default(USER_ROLE.PROVIDER), mealController.deleteMeal);
router2.get("/", mealController.getAllMeals);
router2.get("/:mealId", mealController.getMealById);
var mealRoutes = router2;

// src/modules/category/category.route.ts
import { Router as Router3 } from "express";

// src/modules/category/category.service.ts
var createCategoryInDB = async (name) => {
  const existing = await prisma.category.findUnique({
    where: { name }
  });
  if (existing) {
    throw new AppError(409, "Category already exists");
  }
  return prisma.category.create({
    data: { name }
  });
};
var getAllCategoriesFromDB = async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" }
  });
};
var updateCategoryInDB = async (categoryId, payload) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  if (!category) {
    throw new AppError(404, "Category not found");
  }
  delete payload.id;
  delete payload.createdAt;
  delete payload.updatedAt;
  return prisma.category.update({
    where: { id: categoryId },
    data: payload
  });
};
var categoryService = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  updateCategoryInDB
};

// src/modules/category/category.controller.ts
var createCategory = catchAsync(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new AppError(400, "Category name is required");
  }
  const result = await categoryService.createCategoryInDB(name);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Category created successfully",
    data: result
  });
});
var getAllCategories = catchAsync(async (_req, res) => {
  const result = await categoryService.getAllCategoriesFromDB();
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: result.length > 0 ? "Categories fetched successfully" : "No categories found",
    data: result
  });
});
var updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const { name, isActive } = req.body;
  if (!categoryId) {
    throw new AppError(400, "Category ID is required");
  }
  const result = await categoryService.updateCategoryInDB(
    categoryId,
    { name, isActive }
  );
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Category updated successfully",
    data: result
  });
});
var categoryController = {
  createCategory,
  getAllCategories,
  updateCategory
};

// src/modules/category/category.route.ts
var router3 = Router3();
router3.get("/", categoryController.getAllCategories);
router3.post("/", authMiddleware_default(USER_ROLE.ADMIN), categoryController.createCategory);
router3.patch(
  "/:categoryId",
  authMiddleware_default(USER_ROLE.ADMIN),
  categoryController.updateCategory
);
var categoryRoutes = router3;

// src/modules/provider/provider.routes.ts
import { Router as Router4 } from "express";

// src/modules/provider/provider.service.ts
var createProviderInDB = async (userId, payload) => {
  const existingProvider = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (existingProvider) {
    throw new AppError(409, "Provider profile already exists");
  }
  const provider = await prisma.providerProfile.create({
    data: {
      ...payload,
      userId
    }
  });
  return provider;
};
var getMyProviderFromDB = async (userId) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId },
    include: {
      meals: true
    }
  });
  if (!provider) {
    throw new AppError(404, "Provider profile not found");
  }
  return provider;
};
var updateMyProviderInDB = async (userId, payload) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (!provider) {
    throw new AppError(404, "Provider profile not found");
  }
  delete payload.id;
  delete payload.userId;
  delete payload.createdAt;
  delete payload.updatedAt;
  const updatedProvider = await prisma.providerProfile.update({
    where: { userId },
    data: payload
  });
  return updatedProvider;
};
var getProviderByIdFromDB = async (providerId) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    include: {
      meals: {
        where: { isAvailable: true }
      }
    }
  });
  if (!provider) {
    throw new AppError(404, "Provider not found");
  }
  return provider;
};
var getAllProvidersFromDB = async () => {
  return prisma.providerProfile.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });
};
var providerService = {
  createProviderInDB,
  getMyProviderFromDB,
  updateMyProviderInDB,
  getProviderByIdFromDB,
  getAllProvidersFromDB
};

// src/modules/provider/provider.controller.ts
var createProvider = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  const result = await providerService.createProviderInDB(user.id, req.body);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Provider profile created successfully",
    data: result
  });
});
var getMyProvider = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  const result = await providerService.getMyProviderFromDB(user.id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Provider profile fetched successfully",
    data: result
  });
});
var updateMyProvider = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  const result = await providerService.updateMyProviderInDB(user.id, req.body);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Provider profile updated successfully",
    data: result
  });
});
var getProviderById = catchAsync(async (req, res) => {
  const { providerId } = req.params;
  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }
  const result = await providerService.getProviderByIdFromDB(
    providerId
  );
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Provider fetched successfully",
    data: result
  });
});
var getAllProviders = catchAsync(async (_req, res) => {
  const result = await providerService.getAllProvidersFromDB();
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: result.length > 0 ? "Providers fetched successfully" : "No providers found",
    data: result
  });
});
var providerController = {
  createProvider,
  getMyProvider,
  updateMyProvider,
  getProviderById,
  getAllProviders
};

// src/modules/provider/provider.routes.ts
var router4 = Router4();
router4.post("/", authMiddleware_default(USER_ROLE.PROVIDER), providerController.createProvider);
router4.get("/me", authMiddleware_default(USER_ROLE.PROVIDER), providerController.getMyProvider);
router4.patch(
  "/me",
  authMiddleware_default(USER_ROLE.PROVIDER),
  providerController.updateMyProvider
);
router4.get("/", providerController.getAllProviders);
router4.get("/:providerId", providerController.getProviderById);
var providerRoutes = router4;

// src/modules/order/order.routes.ts
import { Router as Router5 } from "express";

// src/modules/order/order.service.ts
var createOrderInDB = async (customerId, items, deliveryAddress) => {
  if (!items || items.length === 0) {
    throw new AppError(400, "Order must contain at least one item");
  }
  const products = await prisma.meal.findMany({
    where: {
      id: { in: items.map((i) => i.mealId) }
    }
  });
  if (products.length !== items.length) {
    throw new AppError(404, "One or more products not found");
  }
  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.mealId);
    return {
      quantity: item.quantity,
      price: product.price,
      meal: {
        connect: {
          id: product.id
        }
      }
    };
  });
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const providerIds = new Set(products.map((p) => p.providerId));
  if (providerIds.size !== 1) {
    throw new AppError(
      400,
      "You can only order meals from one provider at a time"
    );
  }
  const providerId = products[0]?.providerId;
  if (!providerId) {
    throw new AppError(400, "Provider information is missing");
  }
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerId,
        providerId,
        deliveryAddress,
        totalAmount,
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    });
    return order;
  });
};
var getMyOrdersFromDB = async (customerId) => {
  return prisma.order.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: {
      // select specific fields only
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          meal: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      }
    }
  });
};
var getProviderOrdersFromDB = async (userId) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (!providerProfile) {
    throw new AppError(404, "Provider profile not found");
  }
  return prisma.order.findMany({
    where: { providerId: providerProfile.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      deliveryAddress: true,
      createdAt: true,
      customer: {
        select: {
          name: true,
          email: true
        }
      },
      items: {
        select: {
          quantity: true,
          price: true,
          meal: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
};
var getAllOrdersFromDB = async () => {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true } },
      provider: { select: { name: true } }
    }
  });
};
var getOrderByIdFromDB = async (orderId, userId, role) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { meal: true }
      },
      customer: { select: { name: true, email: true } },
      provider: { select: { name: true } }
    }
  });
  if (!order) throw new AppError(404, "Order not found");
  const isOwner = order.customerId === userId;
  const isProvider = order.providerId === (await prisma.providerProfile.findUnique({ where: { userId } }))?.id;
  const isAdmin = role === "ADMIN";
  if (!isOwner && !isProvider && !isAdmin) {
    throw new AppError(403, "You do not have permission to view this order");
  }
  return order;
};
var updateOrderStatusInDB = async (orderId, newStatus, userId, role) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });
  if (!order) throw new AppError(404, "Order not found");
  if (role === "CUSTOMER") {
    if (newStatus !== "CANCELLED") {
      throw new AppError(403, "Customers can only change status to CANCELLED");
    }
    if (order.status !== "PLACED") {
      throw new AppError(
        400,
        "Cannot cancel order once preparation has started"
      );
    }
    if (order.customerId !== userId) {
      throw new AppError(403, "You can only cancel your own orders");
    }
  }
  if (role === "PROVIDER") {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId }
    });
    if (!providerProfile || order.providerId !== providerProfile.id) {
      throw new AppError(
        403,
        "You can only update orders for your own restaurant"
      );
    }
    if (newStatus === "CANCELLED") {
      throw new AppError(
        403,
        "Providers cannot cancel orders via this endpoint"
      );
    }
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  });
};
var orderService = {
  createOrderInDB,
  getMyOrdersFromDB,
  getProviderOrdersFromDB,
  getAllOrdersFromDB,
  getOrderByIdFromDB,
  updateOrderStatusInDB
};

// src/modules/order/order.controller.ts
var createOrder = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  const { items, deliveryAddress } = req.body;
  if (!deliveryAddress) {
    throw new AppError(400, "Delivery address is required");
  }
  const result = await orderService.createOrderInDB(
    user.id,
    items,
    deliveryAddress
  );
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Order placed successfully",
    data: result
  });
});
var getMyOrders = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  const result = await orderService.getMyOrdersFromDB(user.id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Orders fetched successfully",
    data: result
  });
});
var getProviderOrders = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  const result = await orderService.getProviderOrdersFromDB(user.id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Incoming orders fetched successfully",
    data: result
  });
});
var getAllOrders = catchAsync(async (req, res) => {
  const result = await orderService.getAllOrdersFromDB();
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "All platform orders fetched successfully",
    data: result
  });
});
var getOrderById = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  const result = await orderService.getOrderByIdFromDB(
    orderId,
    user.id,
    user.role
  );
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Order details fetched successfully",
    data: result
  });
});
var updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const user = req.user;
  if (!user) throw new AppError(401, "You are unauthorized");
  if (!orderId) throw new AppError(400, "Order ID is required");
  const result = await orderService.updateOrderStatusInDB(
    orderId,
    status,
    user.id,
    user.role
  );
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: `Order status updated to ${status}`,
    data: result
  });
});
var orderController = {
  createOrder,
  getMyOrders,
  getProviderOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};

// src/modules/order/order.routes.ts
var router5 = Router5();
router5.post("/", authMiddleware_default(USER_ROLE.CUSTOMER), orderController.createOrder);
router5.get("/my-orders", authMiddleware_default(USER_ROLE.CUSTOMER), orderController.getMyOrders);
router5.get(
  "/provider-orders",
  authMiddleware_default(USER_ROLE.PROVIDER),
  orderController.getProviderOrders
);
router5.get("/", authMiddleware_default(USER_ROLE.ADMIN), orderController.getAllOrders);
router5.get(
  "/:orderId",
  authMiddleware_default(USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER),
  orderController.getOrderById
);
router5.patch(
  "/:orderId/status",
  authMiddleware_default(USER_ROLE.PROVIDER, USER_ROLE.CUSTOMER),
  orderController.updateOrderStatus
);
var orderRoutes = router5;

// src/middlewares/routeNotFound.ts
var notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found`,
    dateOfRequest: (/* @__PURE__ */ new Date()).toLocaleString()
  });
};
var routeNotFound_default = notFoundHandler;

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  let statusCode = err?.statusCode || 500;
  let message = err?.message || "Internal Server Error!";
  let errorSources = [];
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    message = "Incorrect field Type/Value provided or Missing Fields";
    const lines = err.message?.split("\n") ?? [];
    errorSources = [
      {
        path: "",
        message: lines[lines.length - 1]?.trim()
      }
    ];
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    statusCode = 400;
    if (err.code === "P2025") {
      message = "Operation failed because the record was not found";
    } else if (err.code === "P2002") {
      message = "Duplicate value found (Unique constraint violation)";
    } else if (err.code === "P2003") {
      message = "Foreign key constraint violation";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "An unexpected Prisma error occurred! Please try again later.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = 500;
    message = "Critical Database Error! engine crashed (Rust Panic). PLease try again later.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      message = "Authentication Failed. Please check your credentials.";
    } else if (err.errorCode === "P1001") {
      statusCode = 400;
      message = "Cannot reach database. Please try again later";
    }
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    // always human-readable
    errors: errorSources.length ? errorSources : void 0,
    stack: process.env.NODE_ENV === "development" ? err.stack : void 0
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/modules/user/user.routes.ts
import { Router as Router6 } from "express";

// src/modules/user/user.service.ts
var getMyProfileFromDB = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      provider: {
        select: { id: true }
      },
      _count: {
        select: {
          orders: true,
          reviews: true
        }
      }
    }
  });
  if (!user) throw new AppError(404, "User profile not found");
  if (user.role === "ADMIN") {
    const { _count, ...adminSafeUser } = user;
    return adminSafeUser;
  }
  let relevantOrderCount = user._count?.orders || 0;
  if (user.role === "PROVIDER" && user.provider) {
    relevantOrderCount = await prisma.order.count({
      where: { providerId: user.provider.id }
    });
  }
  return {
    ...user,
    _count: {
      reviews: user._count?.reviews || 0,
      orders: relevantOrderCount
    }
  };
};
var updateProfileInDB = async (userId, payload) => {
  const { name, phone, image } = payload;
  const updateData = {};
  if (name !== void 0) updateData.name = name;
  if (phone !== void 0) updateData.phone = phone;
  if (image !== void 0) updateData.image = image;
  return await prisma.user.update({
    where: { id: userId },
    data: updateData
  });
};
var getAllUsersFromDB = async () => {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });
};
var updateUserStatusInDB = async (userId, status) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found");
  return await prisma.user.update({
    where: { id: userId },
    data: { status }
  });
};
var userService = {
  getMyProfileFromDB,
  updateProfileInDB,
  getAllUsersFromDB,
  updateUserStatusInDB
};

// src/modules/user/user.controller.ts
var getMyProfile = catchAsync(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const result = await userService.getMyProfileFromDB(req.user.id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Profile fetched successfully",
    data: result
  });
});
var updateProfile = catchAsync(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const result = await userService.updateProfileInDB(req.user.id, req.body);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Culinary identity updated successfully",
    data: result
  });
});
var getAllUsers = catchAsync(async (req, res) => {
  const result = await userService.getAllUsersFromDB();
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Users fetched successfully",
    data: result
  });
});
var changeStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  const result = await userService.updateUserStatusInDB(
    userId,
    status
  );
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: `User status changed to ${status}`,
    data: result
  });
});
var userController = {
  getMyProfile,
  updateProfile,
  getAllUsers,
  changeStatus
};

// src/modules/user/user.routes.ts
var router6 = Router6();
router6.get(
  "/me",
  authMiddleware_default(USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER, USER_ROLE.ADMIN),
  userController.getMyProfile
);
router6.patch(
  "/update-me",
  authMiddleware_default(USER_ROLE.CUSTOMER, USER_ROLE.PROVIDER, USER_ROLE.ADMIN),
  userController.updateProfile
);
router6.get("/", authMiddleware_default(USER_ROLE.ADMIN), userController.getAllUsers);
router6.patch(
  "/:userId/status",
  authMiddleware_default(USER_ROLE.ADMIN),
  userController.changeStatus
);
var userRoutes = router6;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello! This is the Velvet Bites server! :)");
});
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/reviews", reviewRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use(routeNotFound_default);
app.use(globalErrorHandler_default);
var app_default = app;

// src/utils/logger.ts
var logger = {
  info: (msg) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[INFO]: ${msg}`);
    }
  },
  success: (msg) => {
    console.log(`[SUCCESS]: ${msg}`);
  },
  error: (msg, err) => {
    console.error(`[ERROR]: ${msg}`, err || "");
  },
  warn: (msg) => {
    console.warn(`[WARN]: ${msg}`);
  }
};

// src/server.ts
var PORT = process.env.PORT || 5e3;
async function main() {
  try {
    await prisma.$connect();
    logger.success("Connected to database successfully");
    app_default.listen(PORT, () => {
      logger.success(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(
      "Failed to start server due to database connection error",
      error
    );
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();

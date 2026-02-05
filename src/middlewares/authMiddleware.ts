import { fromNodeHeaders } from "better-auth/node";
import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { AppError } from "../errors/AppError";
import { catchAsync } from "../utils/catchAsync";
import { Role, Status } from "../types/user";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: Role;
        emailVerified: boolean;
        status?: Status;
      };
    }
  }
}

const auth = (...roles: Role[]) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      const session = await betterAuth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session) {
        throw new AppError(401, "You are unauthorized");
      }

      if (!session.user.emailVerified) {
        throw new AppError(
          403,
          "Your email is not verified. Please verify your email first.",
        );
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as Role,
        emailVerified: session.user.emailVerified,
        status: session.user.status as Status,
      };

      if (roles.length > 0 && !roles.includes(req.user.role as Role)) {
        throw new AppError(
          403,
          "Forbidden! You do not have permission to access this resource.",
        );
      }

      next();
    },
  );
};

export default auth;

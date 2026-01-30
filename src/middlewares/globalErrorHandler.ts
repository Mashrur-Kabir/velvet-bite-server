import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import { AppError } from "../errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err?.statusCode || 500;
  let message = err?.message || "Internal Server Error!";
  let errorSources: any[] = [];

  /**
   * 1. Prisma Validation Errors
   */
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Incorrect field Type/Value provided or Missing Fields";

    const lines = err.message?.split("\n") ?? [];
    errorSources = [
      {
        path: "",
        message: lines[lines.length - 1]?.trim(),
      },
    ];
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    /**
     * 2. Prisma Known Request Errors
     */
    statusCode = 400;
    if (err.code === "P2025") {
      message = "Operation failed because the record was not found";
    } else if (err.code === "P2002") {
      message = "Duplicate value found (Unique constraint violation)";
    } else if (err.code === "P2003") {
      message = "Foreign key constraint violation";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    /**
     * 3. Prisma Unknown Request Errors
     */
    statusCode = 500;
    message = "An unexpected Prisma error occurred! Please try again later.";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    /**
     * 4. Prisma Rust Panic Errors
     */
    statusCode = 500;
    message =
      "Critical Database Error! engine crashed (Rust Panic). PLease try again later.";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    /**
     * 5. Prisma Initialization Errors
     */
    if (err.errorCode === "P1000") {
      statusCode = 401;
      message = "Authentication Failed. Please check your credentials.";
    } else if (err.errorCode === "P1001") {
      statusCode = 400;
      message = "Cannot reach database. Please try again later";
    }
  } else if (err instanceof AppError) {
    /**
     * 6. Custom app errors
     */
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    /**
     * 7. Generic JS errors
     */
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message, // always human-readable
    errors: errorSources.length ? errorSources : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;

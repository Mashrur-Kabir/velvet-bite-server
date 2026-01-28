import app from "./app";
import { prisma } from "./lib/prisma";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    // Use success or info for the database connection
    logger.success("Connected to database successfully");

    app.listen(PORT, () => {
      logger.success(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    //error logger to capture the connection failure properly
    logger.error(
      "Failed to start server due to database connection error",
      error,
    );

    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

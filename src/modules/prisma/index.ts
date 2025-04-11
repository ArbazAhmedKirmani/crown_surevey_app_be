import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    { level: "query", emit: "event" }, // Log queries
    { level: "info", emit: "event" }, // Log info messages
    { level: "warn", emit: "event" }, // Log warnings
    { level: "error", emit: "event" }, // Log errors
  ],
});

// Listen for query events and log them
prisma.$on("query", (e) => {
  console.log(`Query: ${e.query}`);
  console.log(`Params: ${e.params}`);
  console.log(`Duration: ${e.duration}ms`);
});

// Listen for info events and log them
prisma.$on("info", (e) => {
  console.log(`Info: ${e.message}`);
});

// Listen for warning events and log them
prisma.$on("warn", (e) => {
  console.log(`Warning: ${e.message}`);
});

// Listen for error events and log them
prisma.$on("error", (e) => {
  console.error(`Error: ${e.message}`);
});

export default prisma;

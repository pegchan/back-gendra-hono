import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import verificationRoutes from "./routes/verification.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = new Hono();

// Middleware global
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (origin) => {
      // esto es para desarrollo - permite localhost
      if (
        !origin ||
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1")
      ) {
        return origin || "*";
      }
      return null;
    },
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use("*", errorHandler);

// Health check
app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "KYC Verification API ",
    version: "1.0.0",
  });
});

// API Routes
app.route("/api/verifications", verificationRoutes);

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: "Ruta no encontrada",
    },
    404
  );
});

const port = parseInt(process.env.PORT || "3000");

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`
      API          
  Server running on:  
  http://localhost:${info.port}                
  `);
  }
);

export default app;

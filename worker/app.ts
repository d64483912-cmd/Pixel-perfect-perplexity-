import { Hono } from "hono";
import { cors } from "hono/cors";
import { authenticatedOnly, authMiddleware } from "./middleware/auth";
import { apiRoutes } from "./routes";
import type { HonoContext } from "./types";

const app = new Hono<HonoContext>()
  .use("*", cors())
  .onError((err, c) => {
    return c.json(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred",
        details: err.message,
      },
      500
    );
  })
  .use("*", authMiddleware)
  .get("/ping", (c) => c.json({ message: "ok", timestamp: Date.now() }))
  .get("/protected", authenticatedOnly, (c) =>
    c.json({ message: "ok", timestamp: Date.now() })
  )
  .get("/me", authenticatedOnly, (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ message: "You are not authenticated" }, 401);
    }
    return c.json(user);
  })
  // Mount routers
  .route("/api", apiRoutes);

// Vercel handles static files and SPA fallback via vercel.json
// No catch-all route needed

export type AppType = typeof apiRoutes;
export default app;

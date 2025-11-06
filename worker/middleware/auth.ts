import { createMiddleware } from "hono/factory";
import { createAuth } from "../auth";
import { createDb } from "../db";
import type { HonoContext } from "../types";

export const authMiddleware = createMiddleware(async (c, next) => {
  const env = {
    DATABASE_URL: process.env.DATABASE_URL!,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
    RUNABLE_SECRET: process.env.RUNABLE_SECRET!,
    RUNABLE_GATEWAY_URL: process.env.RUNABLE_GATEWAY_URL!,
    AUTUMN_SECRET_KEY: process.env.AUTUMN_SECRET_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  };

  c.set("env", env);

  const auth = (createAuth as any)(
    env.DATABASE_URL,
    env.BETTER_AUTH_URL,
    env.BETTER_AUTH_SECRET,
    env.ADMIN_EMAIL
  );

  const db = (createDb as any)(env.DATABASE_URL);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
  } else {
    c.set("user", session.user);
    c.set("session", session.session);
  }

  c.set("db", db);
  return next();
});

export const authenticatedOnly = createMiddleware<HonoContext>(
  async (c, next) => {
    const session = c.get("session");
    if (!session) {
      return c.json(
        {
          message: "You are not authenticated",
        },
        401
      );
    } else {
      return next();
    }
  }
);

// Require a specific role (basic RBAC)
export const requireRole = (role: string) =>
  createMiddleware<HonoContext>(async (c, next) => {
    const session = c.get("session");
    const user = c.get("user");

    if (!session) {
      return c.json({ message: "You are not authenticated" }, 401);
    }

    if (!user || user.role !== role) {
      return c.json({ message: "Forbidden: insufficient role" }, 403);
    }

    return next();
  });

// Convenience guard for admin-only routes
export const requireAdmin = requireRole("admin");

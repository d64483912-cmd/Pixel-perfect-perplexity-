import type { createAuth } from "./auth";
import type { createDb } from "./db";

type AppUser = ReturnType<typeof createAuth>["$Infer"]["Session"]["user"] & {
  role?: string;
  provider?: string;
};

export type HonoContext = {
  Variables: {
    user: AppUser | null;
    session:
      | ReturnType<typeof createAuth>["$Infer"]["Session"]["session"]
      | null;
    db: ReturnType<typeof createDb>;
    env: {
      DATABASE_URL: string;
      BETTER_AUTH_SECRET: string;
      BETTER_AUTH_URL: string;
      RUNABLE_SECRET: string;
      RUNABLE_GATEWAY_URL: string;
      AUTUMN_SECRET_KEY?: string;
      ADMIN_EMAIL?: string;
    };
  };
};

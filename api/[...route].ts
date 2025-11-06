import { handle } from "@hono/node-server/vercel";
import app from "../worker/app";

export default handle(app);

import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { insulationRouter } from "./routers/insulation";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
   auth: authRouter,
   insulation: insulationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

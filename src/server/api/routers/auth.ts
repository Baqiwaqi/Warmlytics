import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
   createTRPCRouter,
   protectedProcedure,
} from "~/server/api/trpc";


export const authRouter = createTRPCRouter({
   updateUserPwd: protectedProcedure.input(
      z.object({
         newPassword: z.string(),
      })
   ).mutation(async ({ input, ctx }) => {
      return await ctx.supabase.auth.updateUser({
         email: ctx.session?.user?.email,
         password: input.newPassword,
      }).then(({ error }) => {
         if (error) {
            throw new TRPCError({
               code: "INTERNAL_SERVER_ERROR",
               message: error.message,
            });
         }
         return true;
      });
   }),
});
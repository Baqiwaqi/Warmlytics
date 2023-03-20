import { type User } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
   createTRPCRouter,
   protectedProcedure,
} from "~/server/api/trpc";

// Because aal is missing from the User type, we need to extend it
declare global {
   interface ExtendedUser extends User {
      aal: string;
      amr: {
         method: string;
         timestamp: number;
      }[];
   }
}


export const authRouter = createTRPCRouter({
   getUserData: protectedProcedure.query(async ({ ctx }) => {
      return await ctx.supabase.auth.getSession().then(({ data, error }) => {
         if (error) {
            throw new TRPCError({
               code: "INTERNAL_SERVER_ERROR",
               message: error.message,
            });
         }
         return data?.session?.user as ExtendedUser
      });
   }),
   updateUserPwd: protectedProcedure.input(
      z.object({
         newPassword: z.string(),
      })
   ).mutation(async ({ input, ctx }) => {
      return await ctx.supabase.auth.updateUser({
         email: ctx.session?.user?.email,
         password: input.newPassword,
      }).then(({ data, error }) => {
         console.log(data, error);

         if (error) {
            throw new TRPCError({
               code: "INTERNAL_SERVER_ERROR",
               message: error.message,
            });
         }
         return data?.user as ExtendedUser;
      });
   }),
});
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type BetterInsulation, type CurrentInsulation } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
   createTRPCRouter,
   protectedProcedure,
} from "~/server/api/trpc";

export const insulationRouter = createTRPCRouter({
   createCurrentInsulation: protectedProcedure.input(
      z.object({
         code: z.string(),
         description: z.string(),
         rc: z.number()
      })
   ).mutation(async ({ input, ctx }) => {
      const { code, description, rc } = input;

      return await ctx.prisma.currentInsulation.create({
         data: {
            code: code,
            description: description,
            rc: rc
         }
      }).then((currentInsulation: CurrentInsulation) => {
         return currentInsulation;
      }).catch((error: Error) => {
         throw new TRPCError({
            message: error.message,
            code: "INTERNAL_SERVER_ERROR"
         });
      })
   }),
   updateCurrentInsulation: protectedProcedure.input(
      z.object({
         id: z.string(),
         code: z.string(),
         description: z.string(),
         rc: z.number()
      })
   ).mutation(async ({ input, ctx }) => {
      const { id, code, description, rc } = input;

      return await ctx.prisma.currentInsulation.update({
         where: {
            id: id
         },
         data: {
            code: code,
            description: description,
            rc: rc
         }
      }).then((currentInsulation: CurrentInsulation) => {
         return currentInsulation;
      }).catch((error: Error) => {
         throw new TRPCError({
            message: error.message,
            code: "INTERNAL_SERVER_ERROR"
         });
      })
   }),
   deleteCurrentInsulation: protectedProcedure.input(
      z.object({
         id: z.string()
      })
   ).mutation(async ({ input, ctx }) => {
      const { id } = input;

      return await ctx.prisma.currentInsulation.delete({
         where: {
            id: id
         }
      }).then((currentInsulation: CurrentInsulation) => {
         return currentInsulation;
      }).catch((error: Error) => {
         throw new TRPCError({
            message: error.message,
            code: "INTERNAL_SERVER_ERROR"
         });
      })
   }),
   getAllCurrentInsulation: protectedProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.currentInsulation.findMany().then((currentInsulation: CurrentInsulation[]) => {
         return currentInsulation;
      }).catch((error: Error) => {
         throw new TRPCError({
            message: error.message,
            code: "INTERNAL_SERVER_ERROR"
         });
      })
   }),
   createBetterInsulation: protectedProcedure.input(
      z.object({
         code: z.string(),
         description: z.string(),
         ipv: z.number(),
         rc: z.number(),
         startPrice: z.number().optional(),
         squarePrice: z.number().optional()
      })
   ).mutation(async ({ input, ctx }) => {
      const { code, description, ipv, rc, startPrice, squarePrice } = input;

      return await ctx.prisma.betterInsulation.create({
         data: {
            code: code,
            description: description,
            ipv: ipv,
            rc: rc,
            startPrice: startPrice,
            squarePrice: squarePrice,
         }
      }).then((betterInsulation: BetterInsulation) => {
         return betterInsulation;
      }).catch((error: Error) => {
         throw new TRPCError({
            message: error.message,
            code: "INTERNAL_SERVER_ERROR"
         });
      })
   }),
   updateBetterInsulation: protectedProcedure.input(
      z.object({
         id: z.string(),
         code: z.string(),
         description: z.string(),
         ipv: z.number(),
         rc: z.number(),
         startPrice: z.number().optional(),
         squarePrice: z.number().optional()
      })
   ).mutation(async ({ input, ctx }) => {
      const { id, code, description, ipv, rc, startPrice, squarePrice } = input;

      return await ctx.prisma.betterInsulation.update({
         where: {
            id: id
         },
         data: {
            code: code,
            description: description,
            ipv: ipv,
            rc: rc,
            startPrice: startPrice,
            squarePrice: squarePrice,
         }
      }).then((betterInsulation: BetterInsulation) => {
         return betterInsulation;
      }).catch((error: Error) => {
         throw new TRPCError({
            message: error.message,
            code: "INTERNAL_SERVER_ERROR"
         });
      })
   }),
   deleteBetterInsulation: protectedProcedure.input(
      z.object({
         id: z.string()
      })
   ).mutation(async ({ input, ctx }) => {
      const { id } = input;

      return await ctx.prisma.betterInsulation.delete({
         where: {
            id: id
         }
      }).then((betterInsulation: BetterInsulation) => {
         return betterInsulation;
      }).catch((error: Error) => {
         throw new TRPCError({
            message: error.message,
            code: "INTERNAL_SERVER_ERROR"
         });
      })
   }),
   getAllBetterInsulation: protectedProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.betterInsulation.findMany().then((betterInsulation: BetterInsulation[]) => {
         return betterInsulation;
      }).catch((error: Error) => {
         throw new TRPCError({
            message: error.message,
            code: "INTERNAL_SERVER_ERROR"
         });
      })
   }),
});

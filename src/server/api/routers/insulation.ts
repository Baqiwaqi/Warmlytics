/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type BetterInsulation, type CurrentInsulation } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import Mailjet from "node-mailjet";
import { z } from "zod";

import {
   createTRPCRouter,
   protectedProcedure,
} from "~/server/api/trpc";

const mailjet = Mailjet.apiConnect(`${process.env.MJ_API_KEY as string}`, `${process.env.MJ_API_SECRET as string}`);

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
   sendResultsToEmail: protectedProcedure.input(
      z.object({
         email: z.string().email(),
         projectName: z.string(),
         currentMaterial: z.string(),
         betterMaterial: z.string(),
         savingsGas: z.number(),
         overallSavings: z.number(),
         calculatedCost: z.number(),
         paybackPeriod: z.number(),
      })
   ).mutation(async ({ input }) => {
      console.log("sendResultsToEmail");


      const { email } = input;

      return await mailjet
         .post("send", { 'version': 'v3.1' })
         .request({
            "Messages": [
               {
                  "From": {
                     "Email": `${process.env.MJ_FROM_EMAIL as string}`,
                     "Name": `${process.env.MJ_FROM_NAME as string}`
                  },
                  "To": [
                     {
                        "Email": `${email}`,
                        "Name": `${email}`
                     }
                  ],
                  "Subject": `Resultaten ${input.projectName}`,
                  "TextPart": "Resultaten",
                  "HTMLPart": `<h3> Beste ${email}, </h3>
                     <br/> Uw resultaten zijn berekend. <br /> <br />
                     <strong> Projectnaam: </strong> ${input.projectName}
                     <br />
                     <strong>Huidige isolatie materiaal: </strong> ${input.currentMaterial}
                     <br />
                     <strong>Beter isolatie materiaal: </strong> ${input.betterMaterial}
                     <br />
                     <strong>Besparing gas: </strong> ${input.savingsGas.toFixed(2)} m3
                     <br />
                     <strong>Totale besparing: </strong> ${input.overallSavings.toFixed(2)},- per jaar
                     <br />
                     <strong>Kosten: </strong> ${input.calculatedCost.toFixed(2)},- eenmalig
                     <br />
                     <strong>Terugverdientijd: </strong> ${input.paybackPeriod.toFixed(1)} jaar
                     <br /> <br />
                           Met vriendelijke groet, <br /><br />
                     Isolatie Calculator <br /> `,
                  "CustomID": "AppGettingStartedTest",
               }
            ]
         }).then((result) => {
            console.log(result.body)
            return result.body;
         }).catch((err) => {
            console.log(err);

            console.log(err.statusCode)
            throw new TRPCError({
               message: err.message as string,
               code: "INTERNAL_SERVER_ERROR"
            })
         });
   }),
});

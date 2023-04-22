import { TRPCError } from '@trpc/server';
import Mailjet from 'node-mailjet';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { currencyFormatter, percentageFormatter } from '~/utils/formatters';

export const solarPanelsRouter = createTRPCRouter({
   emailResulter: protectedProcedure.input(
      z.object({
         email: z.string(),
         panels: z.number(),
         peakPower: z.number(),
         yieldFactor: z.number(),
         correctionFactor: z.number(),
         installDate: z.string(),
         thisYearPercentage: z.number(),
         electricityConsumption: z.number(),
         directElectricityPercentage: z.number(),
         investment: z.number(),
         priceKWH: z.number(),
         feedRate: z.number(),
         inflationRate: z.number(),
         totalPeakPower: z.number(),
         totalYield: z.number(),
         selfConsumption: z.number(),
         feedIn: z.number(),
         lessEnergieCosts: z.number(),
         firstYearProfit: z.number(),
         nettoYieldAfter25: z.number(),
         nettoYield: z.number(),
         realizedReturn: z.number(),
      })
   ).mutation(async ({ input }) => {

      const mailjet = Mailjet.apiConnect(`${process.env.MJ_API_KEY as string}`, `${process.env.MJ_API_SECRET as string}`);

      const response = await mailjet.post('send', { version: 'v3.1' }).request({
         Messages: [
            {
               "From": {
                  "Email": `${process.env.MJ_FROM_EMAIL as string}`,
                  "Name": `${process.env.MJ_FROM_NAME as string}`
               },
               "To": [
                  {
                     "Email": `${input.email}`,
                     "Name": `${input.email}`
                  }
               ],
               "Subject": "Uw resultaten",
               "TextPart": "Resultaten",
               "HTMLPart": `<h3> Beste ${input.email}, </h3>
                  <br/> Uw resultaten zijn berekend. <br /> <br />
                  <table>
                     <tr>
                        <td> <b> Aantal panelen: </b> </td>
                        <td> ${input.panels} </td>
                     </tr>
                     <tr>
                        <td> <b> Piekvermogen: </b> </td>
                        <td> ${input.peakPower} </td>
                     </tr>
                     <tr>

                        <td> <b> Opbrengstfactor: </b> </td>
                        <td> ${input.yieldFactor} </td>
                     </tr>
                     <tr>
                        <td> <b> Correctiefactor: </b> </td>
                        <td> ${input.correctionFactor} </td>
                     </tr>
                     <tr>
                        <td> <b> Installatiedatum: </b> </td>
                        <td> ${input.installDate} </td>
                     </tr>
                     <tr>
                        <td> <b> Dit jaar percentage: </b> </td>
                        <td> ${input.thisYearPercentage.toFixed(2)} </td>
                     </tr>
                     <tr>
                        <td> <b> Electriciteitverbruik: </b> </td>
                        <td> ${input.electricityConsumption} </td>
                     </tr>
                     <tr>
                        <td> <b> Directe stroom percentage: </b> </td>
                        <td> ${input.directElectricityPercentage} </td>
                     </tr>

                     <tr>
                        <td> <b> Investering: </b> </td>
                        <td> ${input.investment} </td>
                     </tr>
                     <tr>
                        <td> <b> Prijs per kWh: </b> </td>
                        <td> ${input.priceKWH} </td>
                     </tr>
                     <tr>
                        <td> <b> Teruglevering: </b> </td>
                        <td> ${input.feedRate} </td>
                     </tr>
                     <tr>
                        <td> <b> Inflatiepercentage: </b> </td>
                        <td> ${percentageFormatter(input.inflationRate)} </td>
                     </tr>
                     <tr>
                        <td> <b> Totaal piekvermogen: </b> </td>
                        <td> ${input.totalPeakPower} </td>
                     </tr>
                     <tr>
                        <td> <b> Totaal opbrengst: </b> </td>
                        <td> ${input.totalYield} </td>
                     </tr>
                     <tr>
                        <td> <b> Eigen verbruik: </b> </td>
                        <td> ${input.selfConsumption} </td>
                     </tr>
                     <tr>
                        <td> <b> Teruglevering: </b> </td>
                        <td> ${input.feedIn} </td>
                     </tr>
                     <tr>
                        <td> <b> Minder energiekosten: </b> </td>
                        <td> ${currencyFormatter(input.lessEnergieCosts)} </td>
                     </tr>
                     <tr>
                        <td> <b> Eerste jaar winst: </b> </td>
                        <td> ${input.firstYearProfit} </td>
                     </tr>
                     <tr>
                        <td> <b> Netto opbrengst na 25 jaar: </b> </td>
                        <td> ${currencyFormatter(input.nettoYieldAfter25)} </td>
                     </tr>
                     <tr>
                        <td> <b> Netto opbrengst: </b> </td>
                        <td> ${currencyFormatter(input.nettoYield)} </td>
                     </tr>
                     <tr>
                        <td> <b> Gerealiseerd rendement: </b> </td>
                        <td> ${percentageFormatter(input.realizedReturn)} </td>
                     </tr>
                  </table>
                  <br /> <br />
                  <p> Met vriendelijke groet, <br /> 
                  <br /> <b> Isolatie Calculator </b> </p>
                  `, // HTML body of the message.
            }
         ]
      });

      const responseBody = response.body as { Messages: { Status: string }[] };

      if (responseBody.Messages?.[0]?.Status as string !== 'success') {
         throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong',
         })
      } else {
         return {
            statusCode: 200,
            message: 'Email is verzonden',
         }
      }
   }),
   // other procedures...
});

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { TRPCError } from '@trpc/server';
import moment from 'moment';
import { type GetServerSideProps } from 'next';
import { useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import CustomFormControl from '~/components/common/form-control';
import Layout from '~/components/layout/main';
import { api } from '~/utils/api';
import { currencyFormatter } from '~/utils/formatters';
import { calculateYearPercentage, getPercentage } from '~/utils/helpers';

type SunPanelsPageProps = {
   panels: number;
   peakPower: number;
   yieldFactor: number;
   correctionFactor: number;
   installDate: Date;
   thisYearPercentage: number;
   electricityConsumption: number;
   directElectricityPercentage: number;
   investment: number;
   priceKWH: number;
   feedRate: number;
   inflationRate: number;
   //calculation
   totalPeakPower: number;
   totalYield: number;
   selfConsumption: number;
   feedIn: number;
   lessEnergieCosts: number;
   firstYearProfit: number;
   nettoYieldAfter25: number;
   nettoYield: number;
   realizedReturn: number;
   email: string;
}

const SunPanelsPage = () => {

   const { register, watch, setValue, handleSubmit } = useForm<SunPanelsPageProps>({
      defaultValues: {
         panels: 6,
         peakPower: 300,
         yieldFactor: 75,
         correctionFactor: 90,
         installDate: new Date(),
         thisYearPercentage: calculateYearPercentage(new Date()),

         electricityConsumption: 2500,
         directElectricityPercentage: 30,

         investment: 4200,
         priceKWH: 0.40,
         feedRate: 0.12,
         inflationRate: 2,

         //calculation
         totalPeakPower: 0,
         totalYield: 0,
         selfConsumption: 0,
         feedIn: 0,

         lessEnergieCosts: 0,
         firstYearProfit: 0,
         nettoYieldAfter25: 0,
         nettoYield: 0,
         realizedReturn: 0,
         email: '',
      },
   });

   type YieldTable = {
      year: number;
      factor: number;
      inflationRate?: number;
      yield?: number;
      profit?: number;
   }

   const totalPeakPower = (watch("panels") * watch("peakPower"));
   const totalYield = (totalPeakPower * watch("yieldFactor") * watch("correctionFactor") / 10000);
   const selfConsumption = (totalYield * watch("directElectricityPercentage") / 100);
   const feedIn = (totalYield - selfConsumption);

   useEffect(() => {
      const renderYieldTable = () => {

         const yieldTable: YieldTable[] = [
            { year: 1, factor: 100, inflationRate: 1, yield: 1, profit: 1 },
            { year: 2, factor: 100, inflationRate: 1, yield: 1, profit: 1 },
            { year: 3, factor: 64, inflationRate: 1, yield: 1, profit: 1 },
            { year: 4, factor: 64, inflationRate: 1, yield: 1, profit: 1 },
            { year: 5, factor: 55, inflationRate: 1, yield: 1, profit: 1 },
            { year: 6, factor: 45, inflationRate: 1, yield: 1, profit: 1 },
            { year: 7, factor: 37, inflationRate: 1, yield: 1, profit: 1 },
            { year: 8, factor: 28, inflationRate: 1, yield: 1, profit: 1 },
            { year: 9, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 10, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 11, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 12, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 13, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 14, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 15, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 16, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 17, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 18, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 19, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 20, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 21, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 22, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 23, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 24, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
            { year: 25, factor: 0, inflationRate: 1, yield: 1, profit: 1 },
         ];

         const investment = watch("investment");

         yieldTable.forEach((item, index) => {
            //  (geleidelijk gaat het rendement in 25 jaar van 100% naar 80%).
            // console.log("------", index, "------")
            // Calculate inflation rate
            if (index === 0) {
               item.inflationRate = 1;
            } else {
               item.inflationRate = Number(yieldTable[index - 1]?.inflationRate) * (1 + watch("inflationRate") / 100);
            }

            // Calculate rendemenet goes 100 to 80 in 25 years
            const y = 20 / 25;
            const rendement = (100 - (y * (index))) / 100;
            // console.log("rendement", rendement);

            const factor = item.factor
            const saldering = factor / 100;
            // console.log("saldering", saldering)

            // console.log("rendement", rendement)
            const feedInValue = feedIn * watch("priceKWH") * saldering;
            // console.log("feedInValue", feedInValue)

            const selfConsumptionValue = selfConsumption * watch("priceKWH");
            // console.log("selfConsumptionValue", selfConsumptionValue)

            const feedInSaldering = feedIn * watch("feedRate") * (1 - saldering);
            // console.log("feedInSaldering", feedInSaldering)

            const sum = feedInValue + selfConsumptionValue + feedInSaldering;
            // console.log("sum", sum)

            const percentage = watch("thisYearPercentage") / 100;


            if (index === 0) {

               const yieldValue = sum * percentage * item.inflationRate * rendement;
               // console.log("yieldValue", yieldValue);
               item.yield = yieldValue;
               item.profit = yieldValue - investment;

            } else {
               const yieldValue = sum * item.inflationRate * rendement;
               // console.log("yieldValue", yieldValue);
               item.yield = yieldValue;
               item.profit = Number(yieldTable[index - 1]?.profit) + yieldValue;
            }

         })

         setValue("lessEnergieCosts", yieldTable[1]?.yield as number);
         setValue("firstYearProfit", yieldTable.find((item) => Number(item.profit) > 0)?.year as number);
         setValue("nettoYieldAfter25", yieldTable[24]?.profit as number);
         const nettoYield = yieldTable[24]?.profit as number + watch("investment")
         setValue("nettoYield", nettoYield);
         setValue("realizedReturn", (Math.pow((yieldTable[24]?.profit as number + watch("investment")) / watch("investment"), 1 / 25) * 100) - 100);

         console.log("yieldTable", yieldTable);
         return yieldTable;

      };

      renderYieldTable();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [watch("investment"), watch("thisYearPercentage"), watch("feedRate"), watch("inflationRate"), watch("priceKWH"), feedIn, selfConsumption, setValue]);


   const { mutateAsync: sendResults, isLoading } = api.solarpanels.emailResulter.useMutation()

   const onSubmit = async (data: SunPanelsPageProps) => {
      await sendResults({
         email: data.email,
         panels: data.panels,
         peakPower: data.peakPower,
         yieldFactor: data.yieldFactor,
         correctionFactor: data.correctionFactor,
         installDate: moment(data.installDate).format("DD-MM-YYYY"),
         thisYearPercentage: data.thisYearPercentage,
         electricityConsumption: data.electricityConsumption,
         directElectricityPercentage: data.directElectricityPercentage,
         investment: data.investment,
         priceKWH: data.priceKWH,
         feedRate: data.feedRate,
         inflationRate: data.inflationRate,
         totalPeakPower: totalPeakPower,
         totalYield: totalYield,
         selfConsumption: selfConsumption,
         feedIn: feedIn,
         lessEnergieCosts: data.lessEnergieCosts,
         firstYearProfit: data.firstYearProfit,
         nettoYieldAfter25: data.nettoYieldAfter25,
         nettoYield: data.nettoYield,
         realizedReturn: data.realizedReturn,
      }).then((response) => {
         toast.success(response.message)
      }).catch((error) => {
         if (error instanceof TRPCError) {
            toast.error(error.message)
         }
      })
   };

   return (
      <Layout>
         <main className="flex min-h-screen flex-col items-center justify-start bg-base-100">
            <div className="flex content-center justify-center py-4">
               <h1 className="text-2xl text-[#10275A] font-semibold tracking-tight py-2">
                  Zonnepaneel Calculator
               </h1>
            </div>
            <div className="container card bg-base-100 w-96 flex flex-col px-8">
               <div className="flex content-center justify-center space-x-4">
                  <CustomFormControl label="Aantal panelen">
                     <input className="input input-bordered input-sm w-full max-w-xs"
                        type="number"
                        step={1}
                        {...register("panels")}
                     />
                  </CustomFormControl>
                  <CustomFormControl label="Piekvermogen/paneel">
                     <input className="input input-bordered input-sm w-full max-w-xs"
                        type="number"
                        step={100}
                        {...register("peakPower")}
                     />
                  </CustomFormControl>
               </div>
               <div className="flex content-center justify-center space-x-4 pt-2">
                  <CustomFormControl label="Opbrengstfactor">
                     <input className="input input-bordered input-sm w-full max-w-xs"
                        type="number"
                        step={1}
                        {...register("yieldFactor")}
                     />
                  </CustomFormControl>
                  <CustomFormControl label="Correctiefactor">
                     <input className="input input-bordered input-sm w-full max-w-xs"
                        type="number"
                        step={1}
                        {...register("correctionFactor")}
                     />
                  </CustomFormControl>
               </div>
               <div className="flex content-center justify-center space-x-4 pt-2">
                  <CustomFormControl label="Installatiedatum">
                     <DatePicker
                        className="input input-sm input-bordered w-full"
                        placeholderText="Select date"
                        dateFormat={"dd-MM-yyyy"}
                        selected={watch("installDate")}
                        onChange={(date) => {
                           setValue("installDate", date as Date);
                           const percentage = getPercentage(date as Date);
                           // const percentage = calculateYearPercentage(date as Date);
                           setValue("thisYearPercentage", percentage);

                        }}
                     />
                  </CustomFormControl>
                  <CustomFormControl label="Fractie dit jaar">
                     <input className="input input-bordered input-sm w-full max-w-xs"
                        type="number"
                        disabled
                        value={watch("thisYearPercentage").toFixed(2)}
                     // {...register("thisYearPercentage")}
                     />
                  </CustomFormControl>
               </div>

               <span className="text-md text-[#10275A] font-semibold tracking-tight mt-8">Vebruik</span>
               <div className="flex content-center justify-center space-x-4">
                  <CustomFormControl label="Electricteitsverbruik" >
                     <input className="input input-bordered input-sm w-full max-w-xs"
                        type="number"
                        step={100}
                        {...register("electricityConsumption")}
                     />
                  </CustomFormControl>
                  <CustomFormControl label="Percentage verbruik">
                     <input className="input input-bordered input-sm w-full max-w-xs"
                        type="number"
                        {...register("directElectricityPercentage")}
                     />
                  </CustomFormControl>
               </div>

               <span className="text-md text-[#10275A] font-semibold tracking-tight mt-8">Financieel</span>
               <div className="flex content-center justify-center space-x-4">
                  <CustomFormControl label="Investering" >
                     <input className="input input-bordered input-sm w-full max-w-xs"
                        type="number"
                        step={100}
                        {...register("investment")}
                     />
                  </CustomFormControl>
                  <CustomFormControl label="Prijs per kWh">
                     <input className="input input-bordered input-sm w-full max-w-xs"
                        type="number"
                        {...register("priceKWH")}
                     />
                  </CustomFormControl>
               </div>
               <div className="flex content-center justify-center space-x-4 pt-2">
                  <CustomFormControl label="Terugtarief" >
                     <input className="input input-bordered input-sm w-full max-w-xs"
                        type="number"
                        {...register("feedRate")}
                     />
                  </CustomFormControl>
                  <CustomFormControl label="Inflatie">
                     <input className="input input-bordered input-sm w-full max-w-xs"
                        type="number"
                        {...register("inflationRate")}
                     />
                  </CustomFormControl>
               </div>
               {!isLoading &&
                  <label htmlFor="my-modal" className="btn btn-primary btn-sm mt-8 disabled:opacity-50" >
                     Resultaat Berekenen
                  </label>
               }
               {isLoading &&
                  <button
                     type="button"
                     disabled={isLoading}
                     className={`btn btn-sm btn-primary w-full ${isLoading ? "cursor-not-allowed disabled:" : ""}`}
                  >
                     <svg className="animate-spin h-5 w-5 mr-3 -ml-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                     </svg>
                  </button>
               }
            </div>
         </main>

         <input type="checkbox" id="my-modal" className="modal-toggle" />
         <div className="modal">
            <div className="modal-box p-8 justify-center content-center">
               <div className="flex justify-between">
                  <h3 className="font-bold text-lg text-[#10275A]">Berekeningen</h3>
                  <label htmlFor="my-modal" className="btn btn-ghost btn-sm">
                     <IoClose className="w-5 h-5" />
                  </label>
               </div>
               <div className="flex justify-between mt-6">
                  <div className="flex flex-col space-y-2">
                     <span className="text-sm">Totaal piekvermogen</span>
                     <span className="text-sm">Opbrengst per jaar Kwh</span>
                     <span className="text-sm">Eigen verbruik</span>
                     <span className="text-sm">Teruglevering</span>

                     <span className="text-sm">Minder energiekosten</span>
                     <span className="text-sm">1e verdienjaar</span>
                     <span className="text-sm">Netto opbrengst na 25 jaar</span>
                     <span className="text-sm">Totale opbrengst</span>
                     <span className="text-sm">Gerealiseerde rendement</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                     <span className="text-sm">{totalPeakPower}</span>
                     <span className="text-sm">{totalYield}</span>
                     <span className="text-sm">{selfConsumption}</span>
                     <span className="text-sm">{feedIn}</span>

                     <span className="text-sm">{currencyFormatter(watch("lessEnergieCosts"))}</span>
                     <span className="text-sm">{watch("firstYearProfit")}</span>
                     <span className="text-sm">{currencyFormatter(watch("nettoYieldAfter25"))}</span>
                     <span className="text-sm">{currencyFormatter(watch("nettoYield"))}</span>
                     <span className="text-sm">{currencyFormatter(watch("realizedReturn"))}%</span>
                  </div>
               </div>
               <div className="form-control w-full pt-6">
                  <label className="label py-1">
                     <span className="label-text text-[#8A8BB3]">Emailadres</span>
                  </label>
                  <input
                     type="email"
                     className="input input-bordered input-sm w-full"
                     placeholder="naam@email.nl"
                     {...register("email")}
                  />
               </div>
               <div className="modal-action w-full">
                  <label
                     htmlFor="my-modal"
                     className="btn btn-primary btn-sm w-full"
                     onClick={() => {
                        void handleSubmit(onSubmit)();
                     }}
                  >
                     Verstuur resultaat
                  </label>
               </div>
            </div>
         </div>

         {/* 
            for debugging the table
         <pre>
            {JSON.stringify(yieldTable, null, 2)}
         </pre> */}
      </Layout >
   )
}

export default SunPanelsPage


export const getServerSideProps: GetServerSideProps = async (ctx) => {
   // Create authenticated Supabase Client
   const supabase = createServerSupabaseClient(ctx)
   // Check if we have a session
   const {
      data: { session },
   } = await supabase.auth.getSession()

   if (!session) {
      return {
         redirect: {
            destination: '/auth/signin',
            permanent: false,
         },
      }
   }

   return {
      props: {},
   }
}
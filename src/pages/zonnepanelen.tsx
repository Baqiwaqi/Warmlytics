import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { type GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import CustomFormControl from '~/components/common/form-control';
import Layout from '~/components/layout/main'

type SunPanelsPageProps = {
   amountOfPanels: number;
   peakPower: number;
   yieldFactor: number;
   correctionFactor: number;
   installationDate: Date;
   thisYearGroup: number;
   electricityConsumption: number;
   directElcectricityPercentage: number;
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
         amountOfPanels: 6,
         peakPower: 400,
         yieldFactor: 75,
         correctionFactor: 90,
         installationDate: new Date(),
         thisYearGroup: 72,
         electricityConsumption: 2500,
         directElcectricityPercentage: 30,
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

   const totalPeakPower = (watch("amountOfPanels") * watch("peakPower"));
   const totalYield = (totalPeakPower * watch("yieldFactor") * watch("correctionFactor") / 10000);
   const selfConsumption = (totalYield * watch("directElcectricityPercentage") / 100);
   const feedIn = (totalYield - selfConsumption);


   const onSubmit = (data: SunPanelsPageProps) => {
      console.log(data);
   }

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
                        {...register("amountOfPanels")}
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
                     <input className="input input-bordered input-sm w-full max-w-xs"
                        type="date"
                        {...register("installationDate")}
                     />
                  </CustomFormControl>
                  <CustomFormControl label="Fractie dit jaar">
                     <input className="input input-bordered input-sm w-full max-w-xs"
                        type="number"
                        {...register("peakPower")}
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
                        {...register("directElcectricityPercentage")}
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
               <label htmlFor="my-modal" className="btn btn-primary btn-sm mt-8">
                  Resultaat Berekenen
               </label>
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
      </Layout>
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
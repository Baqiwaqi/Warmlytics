/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
// import { CurrentInsulationArray, NewInsulationArray } from "~/utils/helpers";
import { IoClose } from "react-icons/io5";
import { SlSettings } from "react-icons/sl";
import Layout from "~/components/layout/main";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import CustomFormControl from "~/components/common/form-control";
import { useForm } from "react-hook-form";
import NextLink from "next/link";
import { api } from "~/utils/api";
import { useEffect } from "react";
import { toast } from "react-toastify";

type InsulationProps = {
   project: string;
   gasPrice: number;
   squeareGasUsage: number;
   surfaceArea: number;
   stpr: number;
   matCode: string;
   matDescription: string;
   currentRC: number;
   gasYearlyCost: number;
   newMatCode: string;
   newMatDescription: string;
   rVerb: number;
   gasYearImprovement: number;
   newMaterialCost: number;
   gasSaving: number;
   resultSavings: number;
   calculatedCost: number;
   tvt: number;
   email: string;
};

const Home: NextPage = () => {
   //Fetch data for materials
   const { data: currentInsulation, isLoading: currentLoading, isFetched } = api.insulation.getAllCurrentInsulation.useQuery();
   const { data: newInsulation, isLoading: betterLoading } = api.insulation.getAllBetterInsulation.useQuery();

   const sendEmail = api.insulation.sendResultsToEmail.useMutation();

   const { register, watch, setValue, handleSubmit } = useForm<InsulationProps>({
      defaultValues: {
         project: "",
         gasPrice: 1.45,
         squeareGasUsage: 7.5,
         surfaceArea: 10,
         stpr: 1,
         matCode: "",
         matDescription: "",
         currentRC: currentInsulation?.[0]?.rc || 0,
         gasYearlyCost: 0,
         newMatCode: "",
         newMatDescription: "",
         rVerb: newInsulation?.[0]?.rc,
         gasYearImprovement: 0,
         newMaterialCost: newInsulation?.[0]?.squarePrice || 0,
         gasSaving: 0,
         resultSavings: 0,
         calculatedCost: 0,
         tvt: 0,
         email: "",
      },
   });

   useEffect(() => {
      if (!isFetched) return;
      setValue("currentRC", currentInsulation?.[0]?.rc || 0);
      setValue("rVerb", newInsulation?.[0]?.rc || 0);
      setValue("newMaterialCost", newInsulation?.[0]?.squarePrice || 0);
   }, [currentInsulation, isFetched, newInsulation, setValue]);

   if (currentLoading || betterLoading) {
      return (
         <Layout>
            <div className="flex flex-col items-center justify-center h-screen">
               <span className="text-2xl font-semibold">Loading...</span>
            </div>
         </Layout>
      )
   }

   const gasYearlyCost = (watch("squeareGasUsage") * watch("surfaceArea") / watch("currentRC") * watch("stpr"))
   const gasYearImprovement = (watch("squeareGasUsage") * watch("surfaceArea") / watch("rVerb") * watch("stpr"))

   const handleMatCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const mappedRc = currentInsulation?.find((item) => item.id === e.target.value)?.rc;
      const materialDescription = currentInsulation?.find((item) => item.id === e.target.value)?.description;
      const cost = watch("squeareGasUsage") * watch("surfaceArea") / (mappedRc || 0) * watch("stpr")

      setValue("matCode", e.target.value);
      setValue("matDescription", materialDescription || "");
      setValue("currentRC", mappedRc || 0);
      setValue("gasYearlyCost", cost);
   };

   const handleNewMatCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue("newMatCode", e.target.value);
      const item = newInsulation?.find((item) => item.id === e.target.value);
      const rVerb = Number(item?.rc) + (watch("currentRC") * Number(item?.ipv))
      const nMaterialDescription = newInsulation?.find((item) => item.id === e.target.value)?.description;
      const nMaterialCost = newInsulation?.find((item) => item.id === e.target.value)?.squarePrice;
      const cost = watch("squeareGasUsage") * watch("surfaceArea") / (rVerb || 0) * watch("stpr")

      setValue("newMatCode", e.target.value);
      setValue("newMatDescription", nMaterialDescription || "");
      setValue("rVerb", rVerb || 0);
      setValue("newMaterialCost", nMaterialCost || 0);
      setValue("gasYearImprovement", cost);
   };

   const calculateResults = () => {
      const gasSaving = (gasYearlyCost - gasYearImprovement)
      const resultSavings = (gasSaving * watch("gasPrice"))
      const calculatedCost = (watch("newMaterialCost") * watch("surfaceArea"))
      const tvt = (calculatedCost / resultSavings)

      setValue("gasSaving", gasSaving);
      setValue("resultSavings", resultSavings);
      setValue("calculatedCost", calculatedCost);
      setValue("tvt", tvt);
   };

   const onSubmit = (data: InsulationProps) => {
      sendEmail.mutateAsync({
         email: data.email,
         projectName: data.project,
         currentMaterial: data.matDescription,
         betterMaterial: data.newMatDescription,
         savingsGas: data.gasSaving,
         overallSavings: data.resultSavings,
         calculatedCost: data.calculatedCost,
         paybackPeriod: data.tvt,
      }).then(() => {
         toast.success("Email sent!");
      }).catch((err) => {
         toast.error("Something went wrong!")
      })
   };

   return (
      <Layout>
         <Head>
            <title>Warmlytics</title>
            <meta name="description" content="Generated by create-t3-app" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <main className="flex min-h-screen flex-col items-center justify-start bg-base-100">
            <div className="flex w-full content-end justify-end">
               <NextLink href="/settings/insulation">
                  <button className="btn btn-ghost gap-2">
                     <SlSettings className="text-2xl text-[#10275A]" />
                  </button>
               </NextLink>
            </div>
            <div className="flex content-center justify-center">
               <h1 className="text-2xl text-[#10275A] font-semibold tracking-tight">
                  Isolatie Calculator
               </h1>
            </div>
            <div className="container card bg-base-100 w-96 flex flex-col py-4 px-8">
               <div className="flex content-center justify-center space-x-4 pt-4">
                  <CustomFormControl label="Project" tooltip="Beschrijving van de woning">
                     <input
                        type="text"
                        {...register("project")}
                        className="input input-bordered input-sm w-full max-w-xs"
                     />
                  </CustomFormControl>
               </div>
               <div className="flex content-center justify-center space-x-4 pt-4">
                  <CustomFormControl label="Gas prijs" tooltip="Gebaseerd op prijsplafond van aardgas">
                     <input
                        type="number"
                        step={0.01}
                        {...register("gasPrice")}
                        className="input input-bordered input-sm w-full max-w-xs"
                     />
                  </CustomFormControl>
                  <CustomFormControl label="Gas gebruik m3/m2" tooltip="Hoeveelheid gas die je nodig hebt voor het verwarmen op basia van 1 vierkante meter met een isolatiewaarde van 1." >
                     <input
                        type="number"
                        step={0.01}
                        {...register("squeareGasUsage")}
                        className="input input-bordered input-sm w-full max-w-xs"
                     />
                  </CustomFormControl>
               </div>
               <div className="flex content-center justify-center space-x-4 pt-4">
                  <CustomFormControl label="Oppervlakte" tooltip="Oppervlakt van het element van de schil." >
                     <input
                        type="number"
                        {...register("surfaceArea")}
                        className="input input-bordered input-sm w-full max-w-xs"
                     />
                  </CustomFormControl>
                  <CustomFormControl label="Stookprofiel" tooltip="Stookprofiel, hiermee geef je een profiel van het stookgedrag. Ik gebruik het hier vooral om aan tegen dat op de bovenverdiepingen niet of weinig wordt gestookt waardoor de temperatuur daar lager zal zijn en het warmteverlies dan ook lager is." >
                     <input
                        type="number"
                        {...register("stpr")}
                        className="input input-bordered input-sm w-full max-w-xs"
                     />
                  </CustomFormControl>
               </div>

               {/* huidige situatie */}
               <span className="text-md text-[#10275A] font-semibold tracking-tight mt-4 ">Huidige Situatie</span>
               <CustomFormControl label="Materiaal">
                  <select
                     value={watch("matCode")}
                     onChange={(e) => {
                        handleMatCodeChange(e);

                     }}
                     className="select select-bordered select-sm w-full max-w-xs">
                     {currentInsulation?.map((item) => (
                        <option
                           key={item.id}
                           value={item.id}
                           onClick={() => {
                              setValue("matCode", item.id);
                              setValue("currentRC", item.rc);
                           }}
                        >
                           {item.code}
                        </option>
                     ))}
                  </select>
               </CustomFormControl>
               <div className="flex space-x-4 pt-2">
                  <CustomFormControl label="RC waarde">
                     <input
                        value={watch("currentRC")?.toFixed(2)}
                        className="input-sm w-full max-w-xs px-1 disabled:bg-white disabled:font-bold"
                        disabled
                     />
                  </CustomFormControl>
                  <CustomFormControl label="Gas / Jaar" tooltip="Gasvebruik in m3 per jaar">
                     <input
                        value={gasYearlyCost.toFixed(2)}
                        className="input-sm w-full max-w-xs px-1 disabled:bg-white disabled:font-bold"
                        disabled
                     />
                  </CustomFormControl>
               </div>

               {/* nieuwe situatie */}
               <span className="text-md text-slate-600 font-semibold tracking-tight mt-4">Nieuwe Situatie</span>
               <CustomFormControl label="Materiaal">
                  <select
                     {...register("newMatCode")}
                     value={watch("newMatCode")}
                     onChange={(e) => handleNewMatCodeChange(e)}
                     className="select select-bordered select-sm w-full max-w-xs">
                     {newInsulation?.map((item) => (
                        <option key={item.id} value={item.id} onClick={() => {
                           setValue("newMatCode", item.id);
                           const rVerb = item.rc + (watch("currentRC") * item.ipv);
                           setValue("rVerb", rVerb);
                        }}>
                           {item.code}
                        </option>
                     ))}
                  </select>
               </CustomFormControl>
               <div className="flex space-x-4 mt-4">
                  <CustomFormControl label="RC waarde" tooltip="R-waarde nadat de isolatie verbeterd is.">
                     <input
                        value={watch("rVerb")?.toFixed(2)}
                        className="input-sm w-full max-w-xs px-1 disabled:bg-white disabled:font-bold"
                        disabled
                     />
                  </CustomFormControl>

                  <CustomFormControl label="Gas / Jaar" tooltip="Warmteverlies in m3 per jaar na verbeteringen.">
                     <input
                        value={gasYearImprovement.toFixed(2)}
                        className="input-sm w-full max-w-xs px-1 disabled:bg-white disabled:font-bold"
                        disabled
                     />
                  </CustomFormControl>
               </div>
               <label onClick={calculateResults} htmlFor="my-modal" className="btn btn-primary btn-sm mt-4">
                  Resultaat Bereken
               </label>
            </div>
         </main>
         {/* result modal */}
         <input type="checkbox" id="my-modal" className="modal-toggle" />
         <div className="modal">
            <div className="modal-box p-8 justify-center content-center">
               <div className="flex justify-between">
                  <h3 className="font-bold text-lg text-[#10275A]">Berekeningen {watch("project")}</h3>
                  <label htmlFor="my-modal" className="btn btn-ghost btn-sm">
                     <IoClose className="w-5 h-5" />
                  </label>
               </div>
               <div className="flex justify-between mt-6">
                  <div className="flex flex-col space-y-2">
                     <span className="text-sm">Besparing gas</span>
                     <span className="text-sm">Besparing</span>
                     <span className="text-sm">Kosten</span>
                     <span className="text-sm">TVT</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                     <span className="text-sm">{watch("gasSaving").toFixed(2)} m3</span>
                     <span className="text-sm">{watch("resultSavings").toFixed(2)},- per jaar</span>
                     <span className="text-sm">{watch("calculatedCost")},- eenmalig</span>
                     <span className="text-sm">{watch("tvt").toFixed(2)} jaar</span>
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
         </div >
      </Layout >
   );
};

export default Home;


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


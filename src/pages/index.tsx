import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { CurrentInsulationArray, NewInsulationArray } from "~/utils/helpers";
import { IoClose } from "react-icons/io5";
import Layout from "~/components/layout/main";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import CustomFormControl from "~/components/common/form-control";

const Home: NextPage = () => {
   const [project, setProject] = useState("");
   const [gasPrice, setGasPrice] = useState(1.45);
   const [squeareGasUsage, setSquareGasUsage] = useState(7.5);

   // Current Situation
   const [surfaceArea, setSurfaceArea] = useState(10);
   const [stpr, setStpr] = useState(1);
   const [matCode, setMatCode] = useState(1);
   const [currentRC, setCurrentRC] = useState(CurrentInsulationArray[0]?.rc);
   const [gasYearlyCost, setGasYearlyCost] = useState(squeareGasUsage * surfaceArea / (CurrentInsulationArray[0]?.rc || 0) * stpr);

   // New Situation
   const [newMatCode, setNewMatCode] = useState(1);
   const [rVerb, setRVerb] = useState(NewInsulationArray[0]?.rVerb);
   const [gasYearImprovement, setGasYearImprovement] = useState(squeareGasUsage * surfaceArea / (NewInsulationArray[0]?.rVerb || 0) * stpr);
   const [newMaterialCost, setNewMaterialCost] = useState(NewInsulationArray[0]?.cost || 0);

   const handleMatCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setMatCode(Number(e.target.value));
      const mappedRc = CurrentInsulationArray.find((item) => item.id === Number(e.target.value))?.rc;
      setCurrentRC(mappedRc || 0);
      // calulation = squeareGasUsage * surfaceArea / rc * stpr
      const cost = squeareGasUsage * surfaceArea / (mappedRc || 0) * stpr
      setGasYearlyCost(cost);
   };

   const handleNewMatCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setNewMatCode(Number(e.target.value));

      const rVerb = NewInsulationArray.find((item) => item.id === Number(e.target.value))?.rVerb;
      setRVerb(rVerb || 0);

      const nMaterialCost = NewInsulationArray.find((item) => item.id === Number(e.target.value))?.cost;
      setNewMaterialCost(nMaterialCost || 0);

      const cost = squeareGasUsage * surfaceArea / (rVerb || 0) * stpr
      setGasYearImprovement(cost);
   };

   const [gasSaving, setGasSaving] = useState(0);
   const [resultSavings, setResultsSavings] = useState(0);
   const [calculatedCost, setCalculatedCost] = useState(0);
   const [tvt, setTvt] = useState(0);

   const calculateResults = () => {
      const gasSaving = gasYearlyCost - gasYearImprovement;
      setGasSaving(gasSaving);

      const resSavings = gasSaving * gasPrice;
      setResultsSavings(resSavings);

      const calculatedCost = newMaterialCost * surfaceArea;
      setCalculatedCost(calculatedCost);

      const tvt = calculatedCost / resSavings;
      setTvt(tvt);

   };

   return (
      <Layout>
         <Head>
            <title>Warmlytics</title>
            <meta name="description" content="Generated by create-t3-app" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <main className="flex min-h-screen flex-col items-center justify-start bg-base-100">
            <div className="container card bg-base-100 w-96 flex flex-col p-8">
               <div className="flex content-center justify-center">
                  <h1 className="text-2xl text-[#10275A] font-semibold tracking-tight">
                     Isolatie Calculator
                  </h1>
               </div>
               <div className="flex content-center justify-center space-x-4 pt-4">
                  <CustomFormControl label="Project" tooltip="Beschrijving van de woning">
                     <input
                        type="text"
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        className="input input-bordered input-sm w-full max-w-xs"
                     />
                  </CustomFormControl>
               </div>
               <div className="flex content-center justify-center space-x-4 pt-4">
                  <CustomFormControl label="Gas prijs" tooltip="Gebaseerd op prijsplafond van aardgas">
                     <input
                        type="number"
                        step={0.01}
                        value={gasPrice}
                        onChange={(e) => {
                           setGasPrice(parseFloat(e.target.value));
                        }}
                        className="input input-bordered input-sm w-full max-w-xs"
                     />
                  </CustomFormControl>
                  <CustomFormControl label="Gas gebruik m3/m2" tooltip="Hoeveelheid gas die je nodig hebt voor het verwarmen op basia van 1 vierkante meter met een isolatiewaarde van 1." >
                     <input
                        type="number"
                        step={0.01}
                        value={squeareGasUsage}
                        onChange={(e) => setSquareGasUsage(parseFloat(e.target.value))}
                        className="input input-bordered input-sm w-full max-w-xs"
                     />
                  </CustomFormControl>
               </div>
               <div className="flex content-center justify-center space-x-4 pt-4">
                  <CustomFormControl label="Oppervlakte" tooltip="Oppervlakt van het element van de schil." >
                     <input
                        type="number"
                        value={surfaceArea}
                        onChange={(e) => setSurfaceArea(parseFloat(e.target.value))}
                        className="input input-bordered input-sm w-full max-w-xs"
                     />
                  </CustomFormControl>
                  <CustomFormControl label="Stookprofiel" tooltip="Stookprofiel, hiermee geef je een profiel van het stookgedrag. Ik gebruik het hier vooral om aan tegen dat op de bovenverdiepingen niet of weinig wordt gestookt waardoor de temperatuur daar lager zal zijn en het warmteverlies dan ook lager is." >
                     <input
                        type="number"
                        value={stpr}
                        onChange={(e) => setStpr(parseFloat(e.target.value || "1"))}
                        className="input input-bordered input-sm w-full max-w-xs"
                     />
                  </CustomFormControl>
               </div>
               <span className="text-md text-[#10275A] font-semibold tracking-tight mt-4 ">Huidige Situatie</span>
               <CustomFormControl label="Materiaal" >
                  <select
                     value={matCode}
                     onChange={(e) => handleMatCodeChange(e)}
                     className="select select-bordered select-sm w-full max-w-xs">
                     {CurrentInsulationArray.map((item) => (
                        <option key={item.id} value={item.id}>
                           {item.name}
                        </option>
                     ))}
                  </select>
               </CustomFormControl>
               <div className="flex space-x-4 pt-2">
                  <CustomFormControl label="RC waarde">
                     <input
                        value={currentRC}
                        className="input-sm w-full max-w-xs px-1 disabled:bg-white disabled:font-bold"
                        disabled
                     />
                  </CustomFormControl>
                  <CustomFormControl label="Gas / Jaar" tooltip="Gasvebruik in m3 per jaar">
                     <input
                        value={gasYearlyCost}
                        className="input-sm w-full max-w-xs px-1 disabled:bg-white disabled:font-bold"
                        disabled
                     />
                  </CustomFormControl>
               </div>

               {/* nieuwe situatie */}
               <span className="text-md text-slate-600 font-semibold tracking-tight mt-4">Nieuwe Situatie</span>
               <CustomFormControl label="Materiaal">
                  <select
                     value={newMatCode}
                     onChange={(e) => handleNewMatCodeChange(e)}
                     className="select select-bordered select-sm w-full max-w-xs">
                     {NewInsulationArray.map((item) => (
                        <option key={item.id} value={item.id}>
                           {item.name}
                        </option>
                     ))}
                  </select>
               </CustomFormControl>
               <div className="flex space-x-4 mt-4">
                  <CustomFormControl label="RC waarde" tooltip="R-waarde nadat de isolatie verbeterd is.">
                     <input
                        value={rVerb}
                        className="input-sm w-full max-w-xs px-1 disabled:bg-white disabled:font-bold"
                        disabled
                     />
                  </CustomFormControl>

                  <CustomFormControl label="Gas / Jaar" tooltip="Warmteverlies in m3 per jaar na verbeteringen.">
                     <input
                        value={gasYearImprovement}
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
                  <h3 className="font-bold text-lg text-[#10275A]">Berekeningen {project}</h3>
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
                     <span className="text-sm">{gasSaving.toFixed(2)}m3</span>
                     <span className="text-sm">{resultSavings.toFixed(2)},- per jaar</span>
                     <span className="text-sm">{calculatedCost},- eenmalig</span>
                     <span className="text-sm">{tvt.toFixed(2)} jaar</span>
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
                  />
               </div>
               <div className="modal-action w-full">
                  <label htmlFor="my-modal" className="btn btn-primary btn-sm w-full">Verstuur resultaat</label>
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


/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CurrentInsulation, type BetterInsulation } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { type GetServerSideProps, type NextPage } from "next";
import NextLink from "next/link";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoIosArrowBack } from "react-icons/io";
import { RxDotsVertical } from "react-icons/rx";
import { toast } from "react-toastify";
import { z } from "zod";
import DeleteDialog from "~/components/common/delete-dialog";
import CustomFormControl from "~/components/common/form-control";
import TabPanel from "~/components/common/tab-panel";
import Layout from "~/components/layout/main";
import useDialog from "~/hooks/useDialog";
import useTabs from "~/hooks/useTabs";
import { api } from "~/utils/api";

const InsulationSettings: NextPage = () => {
   const { currentIndex, handleTabs } = useTabs();

   return (
      <Layout>
         <main className="flex min-h-screen flex-col items-center justify-start bg-base-100">
            <div className="flex items-start justify-start w-full p-2">
               <NextLink href="/" passHref>
                  <button className="btn btn-ghost btn-sm">
                     <IoIosArrowBack size={20} /> Terug
                  </button>
               </NextLink>
            </div>
            <div className="flex flex-col content-start justify-start w-full p-2">
               <div className="tabs tabs-boxed bg-white">
                  <a className={currentIndex === 0 ? "tab tab-active" : "tab"} onClick={() => handleTabs(0)}>Huidige Isolatie</a>
                  <a className={currentIndex === 1 ? "tab tab-active" : "tab"} onClick={() => handleTabs(1)}>Verbeter Isolatie</a>
               </div>
               <div className="tab-content">
                  <TabPanel index={0} value={currentIndex}>
                     <CurrentInsulation />
                  </TabPanel>
                  <TabPanel index={1} value={currentIndex}>
                     <ImpoveInsulation />
                  </TabPanel>
               </div>
            </div>
         </main>
      </Layout >
   )
}

export default InsulationSettings

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   // Create authenticated Supabase Client
   const supabase = createServerSupabaseClient(ctx)
   // Check if we have a session
   const { data: { session } } = await supabase.auth.getSession()
   // If no session, redirect to signin page
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

const CurrentInsulation = () => {
   const { data: materials, refetch } = api.insulation.getAllCurrentInsulation.useQuery();

   const deleteCurrentInsulation = api.insulation.deleteCurrentInsulation.useMutation();

   const onDelete = async (id: string) => {
      await deleteCurrentInsulation.mutateAsync({ id: id }).then(() => {
         void refetch();
         toast.success('Current Insulation Deleted Successfully');
      }).catch((err) => {
         toast.error(err.message as string);
      })
   }

   return (
      <div className="flex flex-col">
         {/* <span className="text-[#8A8BB3]">Huidige Isolatie</span> */}
         <CurrentInsulationForm isEdit={false} refetch={refetch} />
         <table className="table table-compact w-full mt-4">
            <thead>
               <tr>
                  <th>Code</th>
                  <th>Omschrijving</th>
                  <th>RC</th>
                  <th></th>
               </tr>
            </thead>
            <tbody>
               {Number(materials?.length) > 0 ? materials?.map((material) => {
                  return (
                     <tr key={material.id}>
                        <td>{material.code}</td>
                        <td>{material.description}</td>
                        <td>{material.rc}</td>
                        <td>
                           <div className="dropdown dropdown-bottom dropdown-end">
                              <label tabIndex={0} className="btn btn-sm btn-ghost m-1">
                                 <RxDotsVertical />
                              </label>
                              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                 <CurrentInsulationForm isEdit={true} currentInsulation={material} refetch={refetch} />
                                 <DeleteDialog title="Delete" message="Are you sure you want to delete this current insulation?" onDelete={() => void onDelete(material?.id)} />
                              </ul>
                           </div>
                        </td>
                     </tr>
                  )
               }) : (
                  <tr>
                     <td colSpan={4}>
                        <span className="text-[#8A8BB3]">Geen huidige isolatie gevonden</span>
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
   )
}

interface ICurrentInsulationForm {
   isEdit: boolean;
   currentInsulation?: CurrentInsulation
   refetch: () => unknown;
}

const CurrentInsulationFormSchema = z.object({
   code: z.string().nonempty(),
   description: z.string().nonempty(),
   rc: z.string().transform((value) => Number(value)).nullable(),
});

const CurrentInsulationForm: React.FC<ICurrentInsulationForm> = ({ isEdit, currentInsulation, refetch }) => {
   const { isOpen, openDialog, closeDialog } = useDialog();

   const {
      register,

      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<CurrentInsulation>({
      defaultValues: {
         code: currentInsulation?.code,
         description: currentInsulation?.description,
         rc: currentInsulation?.rc,
      },
      resolver: zodResolver(CurrentInsulationFormSchema),
   });

   const createCurrentInsulation = api.insulation.createCurrentInsulation.useMutation();
   const updateCurrentInsulation = api.insulation.updateCurrentInsulation.useMutation();

   const onCreate = async (data: CurrentInsulation) => {
      await createCurrentInsulation.mutateAsync({
         code: data.code,
         description: data.description,
         rc: Number(data.rc),
      }).then(() => {
         closeDialog();
         reset();
         refetch();
         toast.success('Current Insulation Created Successfully');
      }).catch((err) => {
         toast.error(err.message as string);
      })
   }

   const onUpdate = async (data: CurrentInsulation) => {
      await updateCurrentInsulation.mutateAsync({
         id: currentInsulation?.id as string,
         code: data.code,
         description: data.description,
         rc: Number(data.rc),
      }).then(() => {
         closeDialog();
         reset();
         refetch();
         toast.success('Current Insulation Updated Successfully');
      }).catch((err) => {
         toast.error(err.message as string);
      })
   }

   return (
      <>
         {isEdit ? (
            <li><a onClick={openDialog}>Edit</a></li >
         ) : (
            <button className="btn btn-accent btn-sm w-48" onClick={openDialog}>Nieuwe Isolatie</button>
         )}
         <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeDialog}>
               <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
               </Transition.Child>

               <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                     <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                     >
                        <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                           <div className="flex justify-between">
                              <Dialog.Title
                                 as="h3"
                                 className="text-lg font-medium leading-6 text-gray-900 py-2"
                              >
                                 {isEdit ? 'Bewerk Isolatie' : 'Isolatie toevoegen'}
                              </Dialog.Title>
                              <button
                                 className="text-gray-500 rounded focus:outline-none focus:shadow-outline hover:text-gray-700"
                                 type="button"
                                 onClick={closeDialog}>
                                 <span >Close</span>
                              </button>
                           </div>
                           <CustomFormControl label="Code" error={errors.code}>
                              <input
                                 type="text"
                                 className={`input input-md input-bordered w-full${errors.code ? 'input-error' : ''}`}
                                 {...register('code')}
                              />
                           </CustomFormControl>
                           <CustomFormControl label="Description" error={errors.description}>
                              <input
                                 type="text"
                                 className={`input input-md input-bordered w-full${errors.description ? 'input-error' : ''}`}
                                 {...register('description')}
                              />
                           </CustomFormControl>
                           <CustomFormControl label="RC" error={errors.rc}>
                              <input
                                 className={`input input-md input-bordered w-full${errors.rc ? 'input-error' : ''}`}
                                 {...register('rc', {
                                    required: true,
                                    pattern: {
                                       value: /^\d+(\.\d{1,2})?$/,
                                       message: 'Invalid number format'
                                    }
                                 })}
                              />
                           </CustomFormControl>
                           <div className="flex justify-end mt-4">
                              <button
                                 className="btn btn-primary"
                                 type="submit"
                                 onClick={() => isEdit ? void handleSubmit(onUpdate)() : void handleSubmit(onCreate)()}
                              >
                                 {isEdit ? 'Update' : 'Create'}
                              </button>
                           </div>
                        </Dialog.Panel>
                     </Transition.Child>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </>
   );
};

const ImpoveInsulation = () => {
   const { data: betterInsulation, refetch } = api.insulation.getAllBetterInsulation.useQuery();

   const deleteBetterInsulation = api.insulation.deleteBetterInsulation.useMutation();

   const onDelete = async (id: string) => {
      await deleteBetterInsulation.mutateAsync({ id: id }).then(() => {
         void refetch();
         toast.success('Better Insulation Deleted Successfully');
      }).catch((err) => {
         toast.error(err.message as string);
      })
   }


   return (
      <div className="flex flex-col">
         <BetterInsulationForm isEdit={false} refetch={refetch} />
         <table className="table table-compact w-full mt-4">
            <thead>
               <tr>
                  <th>Naam</th>
                  {/* gidden when snmall */}
                  <th className="hidden md:table-cell">Omschrijving</th>
                  <th>RC</th>
                  <th>Bij</th>
                  <th>Start Prijs</th>
                  <th>Prijs m2</th>
                  <th></th>
               </tr>
            </thead>
            <tbody>
               {Number(betterInsulation?.length) > 0 ? betterInsulation?.map((item) => (
                  <tr key={item.id}>
                     <td>{item.code}</td>
                     <td className="hidden md:table-cell">{item.description}</td>
                     <td>{item.rc}</td>
                     <td>{item.ipv === 1 ? <span className="badge badge-success">Yes</span> : <span className="badge badge-error">No</span>}</td>
                     <td>{item.startPrice}</td>
                     <td>{item.squarePrice}</td>
                     <td>
                        <div className="dropdown dropdown-bottom dropdown-end">
                           <label tabIndex={0} className="btn btn-sm btn-ghost m-1">
                              <RxDotsVertical />
                           </label>
                           <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                              <BetterInsulationForm isEdit={true} currentInsulation={item} refetch={refetch} />
                              <li><a onClick={() => void onDelete(item.id)}>Delete</a></li>
                           </ul>
                        </div>
                     </td>
                  </tr>
               )) : (
                  <tr><td colSpan={7}>No Data Found</td></tr>
               )}
            </tbody>
         </table>
      </div>
   )
}

interface IBetterInsulationForm {
   isEdit: boolean;
   currentInsulation?: BetterInsulation;
   refetch: () => unknown;
}

const BetterInsulationFormSchema = z.object({
   code: z.string().nonempty(),
   description: z.string().nonempty(),
   rc: z.any().transform((value) => Number(value)).nullable(),
   ipv: z.number(),
   startPrice: z.any().transform((value) => Number(value)).optional(),
   squarePrice: z.any().transform((value) => Number(value)).optional(),
});

const BetterInsulationForm: React.FC<IBetterInsulationForm> = ({ isEdit, currentInsulation, refetch }) => {
   const { isOpen, openDialog, closeDialog } = useDialog();

   const { register, setValue, watch, handleSubmit, reset, formState: { errors } } = useForm<BetterInsulation>({
      resolver: zodResolver(BetterInsulationFormSchema),
      defaultValues: {
         code: currentInsulation?.code,
         description: currentInsulation?.description,
         rc: currentInsulation?.rc,
         ipv: currentInsulation?.ipv ?? 0,
         startPrice: currentInsulation?.startPrice,
         squarePrice: currentInsulation?.squarePrice,
      }
   });

   useEffect(() => {
      if (currentInsulation?.ipv === 0) {
         setValue('ipv', 0);
      } else {
         setValue('ipv', 1);
      }
   }, [currentInsulation?.ipv, setValue])

   const createBetterInsulation = api.insulation.createBetterInsulation.useMutation();
   const updateBetterInsulation = api.insulation.updateBetterInsulation.useMutation();

   const onCreate = async (data: BetterInsulation) => {
      console.log(data);
      await createBetterInsulation.mutateAsync({
         code: data.code,
         description: data.description,
         rc: Number(data.rc),
         ipv: Number(data.ipv),
         startPrice: Number(data.startPrice),
         squarePrice: Number(data.squarePrice),
      }).then(() => {
         closeDialog();
         reset();
         refetch();
         toast.success('Better Insulation Created Successfully');
      }).catch((err) => {
         toast.error(err.message as string);
      })
   }

   const onUpdate = async (data: BetterInsulation) => {
      await updateBetterInsulation.mutateAsync({
         id: currentInsulation?.id as string,
         code: data.code,
         description: data.description,
         rc: Number(data.rc),
         ipv: Number(data.ipv),
         startPrice: Number(data.startPrice),
         squarePrice: Number(data.squarePrice),
      }).then(() => {
         closeDialog();
         reset();
         refetch();
         toast.success('Better Insulation Updated Successfully');
      }).catch((err) => {
         toast.error(err.message as string);
      })
   }

   return (
      <>
         {isEdit ? (
            <li><a onClick={openDialog}>Bewerk</a></li>
         ) : (
            <button className="btn btn-accent btn-sm max-w-fit" onClick={openDialog}>Isolatie toevoegen</button>
         )}
         <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeDialog}>
               <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
               </Transition.Child>

               <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                     <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                     >
                        <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                           <div className="flex justify-between">
                              <Dialog.Title
                                 as="h3"
                                 className="text-lg font-medium leading-6 text-gray-900 py-2"
                              >
                                 {isEdit ? 'Bewerk Isolatie' : 'Isolatie toevoegen'}
                              </Dialog.Title>
                              <button
                                 className="text-gray-500 rounded focus:outline-none focus:shadow-outline hover:text-gray-700"
                                 type="button"
                                 onClick={closeDialog}>
                                 <span >Close</span>
                              </button>
                           </div>
                           <CustomFormControl label="Code" error={errors.code}>
                              <input
                                 type="text"
                                 className={`input input-md input-bordered w-full${errors.code ? 'input-error' : ''}`}
                                 {...register('code')}
                              />
                           </CustomFormControl>
                           <CustomFormControl label="Description" error={errors.description}>
                              <input
                                 type="text"
                                 className={`input input-md input-bordered w-full${errors.description ? 'input-error' : ''}`}
                                 {...register('description')}
                              />
                           </CustomFormControl>
                           <CustomFormControl label="RC" error={errors.rc}>
                              <input
                                 className={`input input-md input-bordered w-full${errors.rc ? 'input-error' : ''}`}
                                 {...register('rc', {
                                    required: true,
                                    pattern: {
                                       value: /^\d+(\.\d{1,2})?$/,
                                       message: 'Invalid number format'
                                    }
                                 })}
                              />
                           </CustomFormControl>
                           <CustomFormControl label="Bij" error={errors.ipv}>
                              <input
                                 type="checkbox"
                                 checked={watch('ipv') !== 0}
                                 className="checkbox"
                                 onChange={(e) => {
                                    setValue('ipv', e.target.checked ? 1 : 0)
                                 }}
                              />
                           </CustomFormControl>
                           <CustomFormControl label="Start Price" error={errors.startPrice}>
                              <input
                                 className={`input input-md input-bordered w-full${errors.startPrice ? 'input-error' : ''}`}
                                 {...register('startPrice', {
                                    required: true,
                                    pattern: {
                                       value: /^\d+(\.\d{1,2})?$/,
                                       message: 'Invalid number format'
                                    }
                                 })}
                              />
                           </CustomFormControl>
                           <CustomFormControl label="Square Price" error={errors.squarePrice}>
                              <input
                                 className={`input input-md input-bordered w-full${errors.squarePrice ? 'input-error' : ''}`}
                                 {...register('squarePrice', {
                                    required: true,
                                    pattern: {
                                       value: /^\d+(\.\d{1,2})?$/,
                                       message: 'Invalid number format'
                                    }
                                 })}
                              />
                           </CustomFormControl>
                           <div className="flex justify-end mt-4">
                              <button
                                 className="btn btn-primary"
                                 type="submit"
                                 onClick={() => isEdit ? void handleSubmit(onUpdate)() : void handleSubmit(onCreate)()}
                              >
                                 {isEdit ? 'Update' : 'Create'}
                              </button>
                           </div>
                        </Dialog.Panel>
                     </Transition.Child>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </>
   );
}


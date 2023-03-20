
import Layout from "~/components/layout/main";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GetServerSideProps } from "next";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import withSSRAuth from "~/server/with-ssr-auth";

const changeProfileSchema = z.object({
   password: z.string().min(6),
   passwordConfirmation: z.string().min(6),
})

type FormData = z.infer<typeof changeProfileSchema>

const validatePasswordConfirmation = (passwordConfirmation: string, password: string) => {
   return passwordConfirmation === password
}

const ProfilePage = () => {
   // Queries
   const { data: user } = api.auth.getUserData.useQuery()


   const {
      handleSubmit,
      register,
      setError,
      formState: { errors },
   } = useForm<FormData>({
      defaultValues: {
         password: "",
         passwordConfirmation: "",
      },
      resolver: zodResolver(changeProfileSchema),
   });

   const updateUserPwd = api.auth.updateUserPwd.useMutation()

   const onSubmit = async (formData: FormData) => {
      const { password, passwordConfirmation } = formData
      if (!validatePasswordConfirmation(passwordConfirmation, password)) {
         setError("passwordConfirmation", {
            type: "manual",
            message: "Password confirmation does not match",
         })
         return;
      }

      await updateUserPwd.mutateAsync({
         newPassword: password,
      }).then((data) => {
         if (data) {
            toast.success("Password updated")
         } else {
            toast.error("Something went wrong")
         }
      })
   }

   return (
      <Layout>
         <div className="flex flex-col justify-center items-center space-y-2 mt-10">
            <div className="card w-8/12 bg-base-100 shadow-xl">
               <div className="card-body">
                  <span className="text-md font-semibold">Email</span>
                  <input type="text" value={user?.email} className="input input-bordered w-full  disabled:bg-white" disabled />
               </div>
            </div>

            <div className="card w-8/12 bg-base-100 shadow-xl">
               <div className="card-body">
                  <span className="text-md font-semibold">Change Password</span>
                  <div className="flex flex-col space-y-2 mt-4">
                     <input
                        type="password"
                        placeholder="New Password"
                        className="input input-bordered w-full"
                        {...register("password")}
                     />
                     {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                     <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="input input-bordered w-full"
                        {...register("passwordConfirmation")}
                     />
                     {errors.passwordConfirmation && <p className="text-red-500">{errors.passwordConfirmation.message}</p>}
                     <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                           void handleSubmit(onSubmit)()
                        }
                        }
                     >
                        Reset Password
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </Layout >
   )
}

export default ProfilePage;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = withSSRAuth(async () => ({
   props: {}
}))


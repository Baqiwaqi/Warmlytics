
import { zodResolver } from "@hookform/resolvers/zod";
import { type TRPCError } from "@trpc/server";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { api } from "~/utils/api";


const changeProfileSchema = z.object({
   password: z.string().min(6),
   passwordConfirmation: z.string().min(6),
})

type FormData = z.infer<typeof changeProfileSchema>

const validatePasswordConfirmation = (passwordConfirmation: string, password: string) => {
   return passwordConfirmation === password
}

const PasswordResetPage = () => {
   const router = useRouter()

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
      }).then(() => {
         toast.success("Password updated")
         void router.push('/')
      }).catch((err: TRPCError) => {
         toast.error(err.message)
      });
   }

   return (
      <div className="flex flex-col items-center justify-center w-screen h-screen">
         <div className="card flex flex-col items-center justify-center w-96 h-96">
            <div className="flex flex-col space-y-2 mt-4">
               <h1 className="text-2xl font-bold">Reset Password</h1>
               <p className="text-sm">Enter your new password</p>
               <form onSubmit={void handleSubmit(onSubmit)} className="flex flex-col space-y-2 mt-4">
                  <input
                     type="password"
                     placeholder="New Password"
                     className="border border-gray-300 rounded-md p-2"
                     {...register("password")}

                  />
                  {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                  <input
                     type="password"
                     placeholder="Confirm New Password"
                     className="border border-gray-300 rounded-md p-2"
                     {...register("passwordConfirmation")}
                  />
                  {errors.passwordConfirmation && <p className="text-red-500">{errors.passwordConfirmation.message}</p>}
                  <button type="submit" className="bg-sky-700 text-white rounded-md p-2">Reset Password</button>
               </form>
            </div>
         </div>
      </div >
   )
}

export default PasswordResetPage
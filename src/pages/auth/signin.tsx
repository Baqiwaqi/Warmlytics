import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { type GetServerSideProps } from "next/types";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";


const SignIn: React.FC = () => {
   const supabase = useSupabaseClient();
   const session = useSession()
   const router = useRouter()
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>();
   const [resetPassword, setResetPassword] = useState(false)

   if (session) {
      void router.push('/')
   }

   const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
      setLoading(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");
      const { error } = await supabase.auth.signInWithPassword({
         email: email as string,
         password: password as string,
      })

      if (error) {
         setError(error.message);
      }

      setLoading(false);

   };


   return (
      <Layout>
         <div className="flex flex-col items-center justify-center w-full max-w-lg p-6 space-y-4 bg-white rounded-xl shadow-lg">
            {resetPassword
               ? (<SBResetPassword setResetPassword={setResetPassword} />)
               : (<form className="flex flex-col w-full space-y-4" onSubmit={() => handleSignIn}>
                  <div className="flex flex-col items-center justify-center space-y-2">
                     <h1 className="text-4xl font-bold text-[#10275A]">Isolator Calculator</h1>
                  </div>
                  <div className="form-control w-full">
                     <label className="label py-1">
                        <span className="label-text text-[#8A8BB3]">Email</span>
                     </label>
                     <input
                        type="email"
                        name="email"
                        id="email"
                        className="input input-bordered input-sm w-full"
                     />
                  </div>
                  <div className="form-control w-full">
                     <label className="label py-1">
                        <span className="label-text text-[#8A8BB3]">Password</span>
                     </label>
                     <input
                        type="password"
                        name="password"
                        id="password"
                        className="input input-bordered input-sm w-full"
                     />
                  </div>
                  <button
                     disabled={loading}
                     type="submit"

                     className="btn btn-primary btn-sm w-full"
                  >
                     Sign In
                  </button>
               </form>
               )}
            {error && <p className="text-red-500">{error}</p>}
            {!resetPassword &&
               <button
                  onClick={() => setResetPassword(true)}
                  className="text-sm text-gray-500 hover:text-gray-700"
               >
                  Forgot Password?
               </button>}
         </div>
      </Layout>
   );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
   // Create authenticated Supabase Client
   const supabase = createServerSupabaseClient(ctx)
   // Check if we have a session
   const {
      data: { session },
   } = await supabase.auth.getSession()

   if (session) {
      return {
         redirect: {
            destination: '/',
            permanent: false,
         },
      }
   }

   return {
      props: {

      },
   }
}


type Props = {
   children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center relative z-1 bg-gradient-to-tr from-[#10275A] to-[#444572] ">
         {children}
         <ToastContainer
            className="z-50"
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
         />
      </div>
   );
};



interface ISBResetPassword {
   setResetPassword: React.Dispatch<React.SetStateAction<boolean>>
}

const SBResetPassword: React.FC<ISBResetPassword> = ({ setResetPassword }) => {
   const supabase = useSupabaseClient();
   const [email, setEmail] = useState<string>('')

   const handleResetPassword = async () => {

      if (!email) {
         toast.error('Please enter your email address.')
         return
      }

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
         redirectTo: 'http://localhost:3000/reset-password',
      })

      if (data) {
         toast.success('Check your email for a password reset link.')
      }

      if (error) {
         toast.error(error.message)
      }
   }

   return (
      <div className="flex flex-col justify-start mt-40 items-center  bg-white">
         <h1 className="text-2xl font-bold text-gray-700">Reset Password</h1>
         <p className="text-sm text-gray-500">Enter your email address below and we will send you a link to reset your password.</p>
         <input type="text" placeholder="John@doe.nl" className="input input-bordered w-full" onChange={(e) => {
            setEmail(e.target.value)
         }} />
         <button className="btn btn-sm  btn-primary mt-4"
            onClick={() => handleResetPassword}>
            Send Reset Link
         </button>
         <button className="text-sm text-gray-500 hover:text-gray-700 mt-4"
            onClick={() => {
               setResetPassword(false)
            }}>
            Back to Sign In
         </button>
      </div >
   )
}
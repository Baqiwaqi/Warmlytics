import NextLink from "next/link";
import { ToastContainer } from 'react-toastify';
import { RxAvatar } from "react-icons/rx";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import drawerLinks from "./drawer-links";

interface ILayout {
   children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
   const router = useRouter();
   const session = useSession();
   const supabase = useSupabaseClient()

   const handleSignOut = async () => {
      try {

         await supabase.auth.signOut()
         void router.push('/auth/signin')
      } catch (error) {
         console.log('error', error)
      }
   }

   return (
      <div className="drawer drawer-mobile">
         <input id="my-drawer" type="checkbox" className="drawer-toggle" />
         <div className="drawer-content">
            {/* Navbar */}
            <div className="navbar bg-primary">
               <div className="flex-none">
                  <label htmlFor="my-drawer" className="btn btn-ghost text-white drawer-button mr-2 lg:hidden">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                  </label>
               </div>
               <div className="flex-1">
                  {/* <a className="btn btn-ghost normal-case text-xl"></a> */}
               </div>
               <div className="flex-none">
                  <div className="dropdown dropdown-end">
                     <div className="flex items-center">
                        <span className="text-white text-sm mr-2">{session?.user.email}</span>
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar text-white">
                           <div className="w-10 rounded-full">
                              <RxAvatar className="w-10 h-10" />
                           </div>
                        </label>
                     </div>
                     <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                        <li>
                           <NextLink href={"/profile"} className="justify-between">
                              Profile
                              <span className="badge">New</span>
                           </NextLink>
                        </li>
                        {/* <li><a>Settings</a></li> */}
                        <li><a onClick={() => void handleSignOut()}>Logout</a></li>
                     </ul>
                  </div>
               </div>
            </div>
            {/* Content */}
            <div className="flex flex-col min-h-[96vh] bg-base-100">
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
         </div>
         <div className="drawer-side shadow-md">
            <label htmlFor="my-drawer" className="drawer-overlay" >  </label>
            <ul className="menu p-4 w-80 bg-base-100 text-slate-700">
               <div className="flex items-center justify-center mt-1">
                  <h1 className="text-2xl text-[#10275A] font-semibold tracking-tight">
                     Isolatie Calculator
                  </h1>
               </div>
               <li className="divider my-4" />
               {drawerLinks.map((link, index) => (
                  <li key={index}>
                     <NextLink href={link.href} className="text-lg tracking-wide">
                        {link.icon}
                        {link.label}
                     </NextLink>
                  </li>
               ))}

            </ul>
         </div>
      </div >
   )
}


export default Layout
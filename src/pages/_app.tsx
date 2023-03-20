import { type Session, createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { api } from "~/utils/api";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps<{
   initialSession: Session,
}>) => {

   const [supabase] = useState(() => createBrowserSupabaseClient())

   return (
      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
         <Component {...pageProps} />
      </SessionContextProvider>
   );
};

export default api.withTRPC(MyApp);

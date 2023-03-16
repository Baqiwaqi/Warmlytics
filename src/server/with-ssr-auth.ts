import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { GetServerSideProps } from "next/types";

const withSSRAuth = (pageGssp: GetServerSideProps) => {
   const gssp: GetServerSideProps = async (ctx) => {
      // Create authenticated Supabase Client
      const supabase = createServerSupabaseClient(ctx)
      // Check if we have a session
      const { data: { session } } = await supabase.auth.getSession()

      if (!session)
         return {
            redirect: {
               destination: '/auth/signin',
               permanent: false,
            },
         }

      return pageGssp(ctx);
   };
   return gssp;
}


export default withSSRAuth;
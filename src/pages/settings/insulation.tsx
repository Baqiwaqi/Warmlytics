import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { type GetServerSideProps, type NextPage } from "next/types"
import Layout from "~/components/layout/main"


const InsulationSettings: NextPage = () => {

   return (
      <Layout>
         <h1>Insulation Settings</h1>
      </Layout>
   )
}

export default InsulationSettings

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


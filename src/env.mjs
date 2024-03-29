import { z } from "zod";

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
   DATABASE_URL: z.string().url(),
   SHADOW_DATABASE_URL: z.string().url(),
   NODE_ENV: z.enum(["development", "test", "production"]),
   NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
   NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
   MJ_API_KEY: z.string(),
   MJ_API_SECRET: z.string(),
   MJ_FROM_EMAIL: z.string().email(),
   MJ_FROM_NAME: z.string(),
   // Add `.min(1) on ID and SECRET if you want to make sure they're not empty
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
   // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
   DATABASE_URL: process.env.DATABASE_URL,
   SHADOW_DATABASE_URL: process.env.SHADOW_DATABASE_URL,
   NODE_ENV: process.env.NODE_ENV,
   NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
   NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
   MJ_API_KEY: process.env.MJ_API_KEY,
   MJ_API_SECRET: process.env.MJ_API_SECRET,
   MJ_FROM_EMAIL: process.env.MJ_FROM_EMAIL,
   MJ_FROM_NAME: process.env.MJ_FROM_NAME,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
   const isServer = typeof window === "undefined";

   const parsed = /** @type {MergedSafeParseReturn} */ (
      isServer
         ? merged.safeParse(processEnv) // on server we can validate all env vars
         : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
   );

   if (parsed.success === false) {
      console.error(
         "❌ Invalid environment variables:",
         parsed.error.flatten().fieldErrors,
      );
      throw new Error("Invalid environment variables");
   }

   env = new Proxy(parsed.data, {
      get(target, prop) {
         if (typeof prop !== "string") return undefined;
         // Throw a descriptive error if a server-side env var is accessed on the client
         // Otherwise it would just be returning `undefined` and be annoying to debug
         if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
            throw new Error(
               process.env.NODE_ENV === "production"
                  ? "❌ Attempted to access a server-side environment variable on the client"
                  : `❌ Attempted to access server-side environment variable '${prop}' on the client`,
            );
         return target[/** @type {keyof typeof target} */ (prop)];
      },
   });
}

export { env };

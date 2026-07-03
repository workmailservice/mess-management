import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth/auth";

// No baseURL needed: the client and the /api/auth/* handler are served
// from the same Next.js app, so it defaults to same-origin.
export const authClient = createAuthClient({
  // Gives the client type-safe knowledge of roleId/status/phone additionalFields.
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signOut, useSession } = authClient;

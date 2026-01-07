import { createAuthClient } from "better-auth/react";
import {
  organizationClient,
  inferOrgAdditionalFields,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3001",
  plugins: [
    organizationClient({
      schema: inferOrgAdditionalFields({
        organization: {
          additionalFields: {
            // Informations de base
            companyName: { type: "string" },
            companyEmail: { type: "string" },
            companyPhone: { type: "string" },
            website: { type: "string" },
            // Informations légales
            siret: { type: "string" },
            vatNumber: { type: "string" },
            // Adresse
            addressStreet: { type: "string" },
            addressCity: { type: "string" },
            addressZipCode: { type: "string" },
            addressCountry: { type: "string" },
            // Coordonnées bancaires
            bankName: { type: "string" },
            bankIban: { type: "string" },
            bankBic: { type: "string" },
          },
        },
      }),
    }),
  ],
});

export const {
  signUp,
  signIn,
  signOut,
  updateUser,
  forgetPassword,
  resetPassword,
  useSession,
  organization,
} = authClient;

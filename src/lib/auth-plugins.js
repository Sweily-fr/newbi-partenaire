import { organization } from "better-auth/plugins";

// Plugin d'organisation pour les partenaires
export const organizationPlugin = organization({
  allowUserToCreateOrganization: true,
  organizationLimit: 1, // Un partenaire = une organisation
  creatorRole: "owner",
  
  schema: {
    organization: {
      fields: {
        // Informations de base
        companyName: {
          type: "string",
          required: false,
        },
        companyEmail: {
          type: "string",
          required: false,
        },
        companyPhone: {
          type: "string",
          required: false,
        },
        website: {
          type: "string",
          required: false,
        },
        // Informations légales
        siret: {
          type: "string",
          required: false,
        },
        vatNumber: {
          type: "string",
          required: false,
        },
        // Adresse
        addressStreet: {
          type: "string",
          required: false,
        },
        addressCity: {
          type: "string",
          required: false,
        },
        addressZipCode: {
          type: "string",
          required: false,
        },
        addressCountry: {
          type: "string",
          required: false,
        },
        // Coordonnées bancaires
        bankName: {
          type: "string",
          required: false,
        },
        bankIban: {
          type: "string",
          required: false,
        },
        bankBic: {
          type: "string",
          required: false,
        },
      },
    },
  },
});

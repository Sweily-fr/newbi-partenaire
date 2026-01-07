import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { mongoDb } from "./mongodb";
import { organizationPlugin } from "./auth-plugins";
import { sendVerificationEmail, sendResetPasswordEmail } from "./auth-utils";

export const auth = betterAuth({
  database: mongodbAdapter(mongoDb),
  appName: "Newbi Partner",

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    "http://localhost:3001",
    "https://partner.newbi.fr",
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 jours
    updateAge: 60 * 60 * 24, // 24 heures
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    additionalFields: {
      activeOrganizationId: {
        type: "string",
        required: false,
      },
    },
  },

  // Database hooks pour gérer la création d'organisation
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // ✅ Définir isPartner à true pour tous les nouveaux utilisateurs
          return {
            data: {
              ...user,
              isPartner: true,
            },
          };
        },
        after: async (user) => {
          try {
            const { mongoDb } = await import("./mongodb.js");
            const { ObjectId } = await import("mongodb");

            console.log(
              `🔄 [PARTNER USER CREATE] Création organisation pour ${user.email}...`
            );

            // Vérifier si l'utilisateur a déjà une organisation
            const existingMember = await mongoDb
              .collection("member")
              .findOne({ userId: new ObjectId(user.id) });

            if (existingMember) {
              console.log(
                `✅ [PARTNER USER CREATE] Organisation déjà existante pour ${user.email}, skip création`
              );
              return user;
            }

            // Générer le nom et le slug de l'organisation
            const organizationName =
              user.name || `Partner ${user.email.split("@")[0]}'s`;
            const organizationSlug = `partner-org-${user.id.slice(-8)}`;

            const now = new Date();

            // Créer l'organisation
            const orgResult = await mongoDb
              .collection("organization")
              .insertOne({
                name: organizationName,
                slug: organizationSlug,
                logo: null,
                metadata: {
                  autoCreated: true,
                  createdAt: now.toISOString(),
                  isPartnerOrg: true,
                },
                createdAt: now,
              });

            const organizationId = orgResult.insertedId;
            console.log(
              `✅ [PARTNER USER CREATE] Organisation créée: ${organizationId}`
            );

            // Créer le membre owner
            await mongoDb.collection("member").insertOne({
              organizationId: organizationId,
              userId: new ObjectId(user.id),
              email: user.email,
              role: "owner",
              createdAt: now,
            });

            console.log(
              `✅ [PARTNER USER CREATE] Membre owner créé pour ${user.email}`
            );
          } catch (error) {
            console.error(
              "❌ [PARTNER USER CREATE] Erreur création organisation:",
              error
            );
          }

          return user;
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          try {
            const { mongoDb } = await import("./mongodb.js");
            const { ObjectId } = await import("mongodb");

            console.log(
              `🔍 [PARTNER SESSION CREATE] Recherche organisation pour userId: ${session.userId}`
            );

            // Chercher une organisation owner
            const ownerMember = await mongoDb.collection("member").findOne({
              userId: new ObjectId(session.userId),
              role: "owner",
            });

            if (ownerMember) {
              console.log(
                `✅ [PARTNER SESSION CREATE] Organisation owner trouvée: ${ownerMember.organizationId}`
              );

              return {
                data: {
                  ...session,
                  activeOrganizationId: ownerMember.organizationId.toString(),
                },
              };
            }

            // Fallback : chercher n'importe quelle organisation
            const anyMember = await mongoDb.collection("member").findOne({
              userId: new ObjectId(session.userId),
            });

            if (anyMember) {
              console.log(
                `✅ [PARTNER SESSION CREATE] Organisation trouvée (fallback): ${anyMember.organizationId}`
              );

              return {
                data: {
                  ...session,
                  activeOrganizationId: anyMember.organizationId.toString(),
                },
              };
            }

            console.warn(
              "⚠️ [PARTNER SESSION CREATE] Aucune organisation trouvée"
            );
            return { data: session };
          } catch (error) {
            console.error("❌ [PARTNER SESSION CREATE] Erreur:", error);
            return { data: session };
          }
        },
      },
    },
  },

  plugins: [
    jwt(),
    organizationPlugin,
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // ✅ Vérification email activée
    async signInRateLimit() {
      return {
        window: 60,
        max: 5,
      };
    },
    async beforeSignIn({ user }) {
      // ✅ VÉRIFICATION CRITIQUE : Seuls les partenaires peuvent se connecter
      if (!user.isPartner) {
        throw new Error(
          "Accès refusé. Vous devez être un partenaire pour accéder à cette interface."
        );
      }

      // Vérifier si le compte est actif
      if (user.isActive === false) {
        throw new Error(
          "Votre compte partenaire a été désactivé. Veuillez contacter le support."
        );
      }

      // Vérifier si l'email est vérifié (Better Auth gère cela automatiquement avec requireEmailVerification: true)
      if (!user.emailVerified) {
        throw new Error(
          "Veuillez vérifier votre adresse email avant de vous connecter."
        );
      }

      return user;
    },
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user, url);
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user, url);
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 heure pour vérifier l'email

    // Callback après vérification réussie
    async afterEmailVerification(user, request) {
      console.log(`✅ [PARTNER EMAIL VERIFICATION] Email vérifié pour ${user.email}`);

      try {
        const { mongoDb } = await import("./mongodb.js");
        const { ObjectId } = await import("mongodb");

        // Vérifier que l'utilisateur a une organisation
        const member = await mongoDb.collection("member").findOne({
          userId: new ObjectId(user.id),
          role: "owner",
        });

        if (!member) {
          console.warn(
            `⚠️ [PARTNER EMAIL VERIFICATION] Aucune organisation owner pour ${user.email}`
          );

          // Fallback : chercher n'importe quelle organisation
          const anyMember = await mongoDb.collection("member").findOne({
            userId: new ObjectId(user.id),
          });

          if (!anyMember) {
            console.error(
              `❌ [PARTNER EMAIL VERIFICATION] Aucune organisation trouvée pour ${user.email}`
            );
            return;
          }

          console.log(
            `✅ [PARTNER EMAIL VERIFICATION] Organisation trouvée (fallback): ${anyMember.organizationId}`
          );
        } else {
          console.log(
            `✅ [PARTNER EMAIL VERIFICATION] Organisation owner trouvée: ${member.organizationId}`
          );
        }
      } catch (error) {
        console.error(
          "❌ [PARTNER EMAIL VERIFICATION] Erreur lors de la vérification de l'organisation:",
          error
        );
      }
    },
  },

  user: {
    additionalFields: {
      name: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      lastName: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      phoneNumber: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      company: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      avatar: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      // ✅ NOUVEAU CHAMP : isPartner
      isPartner: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      // Code de parrainage unique pour chaque partenaire
      referralCode: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
});

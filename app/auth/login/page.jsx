"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/src/lib/auth-client";
import { authClient } from "@/src/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input, InputPassword } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { EmailVerificationDialog } from "./components/EmailVerificationDialog";
import { AnimatedShapesBackground } from "@/components/animated-shapes-background";

// Fonction pour s'assurer qu'une organisation active est définie
const ensureActiveOrganization = async () => {
  try {
    console.log("🔍 [ENSURE ORG] Vérification de l'organisation active...");
    
    // Vérifier s'il y a déjà une organisation active
    const { data: activeOrg } = await authClient.organization.getActive();

    if (activeOrg) {
      console.log(`✅ [ENSURE ORG] Organisation active déjà définie: ${activeOrg.id}`);
      return;
    }

    console.log("⚠️ [ENSURE ORG] Aucune organisation active, tentative de définition...");
    
    // Récupérer les organisations de l'utilisateur
    const { data: organizations, error: orgsError } =
      await authClient.organization.list();

    if (orgsError) {
      console.error(
        "❌ [ENSURE ORG] Erreur lors de la récupération des organisations:",
        orgsError
      );
      return;
    }

    console.log(`📊 [ENSURE ORG] ${organizations?.length || 0} organisation(s) trouvée(s)`);

    // Si pas d'organisation active et qu'il y a des organisations disponibles
    if (organizations && organizations.length > 0) {
      const selectedOrg = organizations[0];
      
      const { error: setActiveError } = await authClient.organization.setActive({
        organizationId: selectedOrg.id,
      });

      if (setActiveError) {
        console.error(
          "❌ [ENSURE ORG] Erreur lors de la définition de l'organisation active:",
          setActiveError
        );
      } else {
        console.log(`✅ [ENSURE ORG] Organisation active définie avec succès: ${selectedOrg.id}`);
      }
    } else {
      console.log("⚠️ [ENSURE ORG] Aucune organisation trouvée, création d'une nouvelle...");
      try {
        // Récupérer l'utilisateur actuel depuis la session
        const { data: session } = await authClient.getSession();
        const user = session?.user;

        if (!user || !user.id) {
          console.error(
            "❌ Utilisateur non disponible dans la session:",
            session
          );
          return;
        }

        // Générer le nom et le slug de l'organisation
        const organizationName = user.name || `Espace ${user.email.split("@")[0]}`;
        const organizationSlug = `org-${user.id.slice(-8)}`;

        console.log(
          `🔄 Création organisation pour ${user.email}...`
        );

        // Créer l'organisation directement avec authClient
        const result = await authClient.organization.create({
          name: organizationName,
          slug: organizationSlug,
          metadata: {
            autoCreated: true,
            createdAt: new Date().toISOString(),
          },
        });

        if (result.error) {
          console.error(
            "❌ Erreur lors de la création de l'organisation:",
            result.error
          );
        } else {
          console.log(`✅ Organisation créée:`, result.data);
          toast.success("Votre espace de travail a été créé.");
        }
      } catch (error) {
        console.error("❌ Erreur lors de la création automatique:", error);
      }
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'organisation active:",
      error
    );
  }
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const router = useRouter();
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmailForVerification, setUserEmailForVerification] = useState("");

  const onSubmit = async (formData) => {
    try {
      await signIn.email(formData, {
        onSuccess: async () => {
          toast.success("Connexion réussie");
          
          // Définir l'organisation active après la connexion
          await ensureActiveOrganization();
          
          router.push("/dashboard");
        },
        onError: (err) => {
          // Gérer l'erreur de vérification d'email
          if (err?.message?.toLowerCase().includes("email") && 
              err?.message?.toLowerCase().includes("verif")) {
            setUserEmailForVerification(formData.email);
            setShowEmailVerification(true);
            toast.error("Veuillez vérifier votre email avant de vous connecter");
          } else if (err?.message?.toLowerCase().includes("not verified")) {
            setUserEmailForVerification(formData.email);
            setShowEmailVerification(true);
            toast.error("Veuillez vérifier votre email avant de vous connecter");
          } else {
            const errorMessage = err?.message || "Email ou mot de passe incorrect";
            toast.error(errorMessage);
          }
        },
      });
    } catch {
      toast.error("Erreur de connexion");
    }
  };

  return (
    <>
      <form
        action="#"
        method="post"
        className="mt-6 space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
      <div>
        <Label
          htmlFor="email"
          className="text-sm font-medium text-white"
        >
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40"
          {...register("email", {
            required: "Email est requis",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email invalide",
            },
          })}
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <InputPassword
          label="Mot de passe"
          placeholder="Saisissez votre mot de passe"
          autoComplete="current-password"
          {...register("password", {
            required: "Mot de passe est requis",
          })}
        />
        {errors.password && (
          <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="mt-4 w-full py-2 font-normal cursor-pointer bg-[#5b50FF] hover:bg-[#5b50FF]/90 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connexion...
          </>
        ) : (
          "Se connecter"
        )}
      </Button>
    </form>

    {/* Modal de vérification d'email */}
    <EmailVerificationDialog
      isOpen={showEmailVerification}
      onClose={() => setShowEmailVerification(false)}
      userEmail={userEmailForVerification}
    />
    </>
  );
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden">
      {/* Animated Background Shapes */}
      <AnimatedShapesBackground />

      <main className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-semibold text-white">
              Espace Partenaire
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-white/60">
              Vous n&apos;avez pas de compte ?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-[#5b50FF] hover:text-[#5b50FF]/90"
              >
                Inscription
              </Link>
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 sm:p-6">
            <LoginForm />
          </div>

          <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-center text-white/60">
            <Link
              href="/"
              className="font-medium text-[#5b50FF] hover:text-[#5b50FF]/90"
            >
              ← Retour à l&apos;accueil
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/src/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input, InputPassword } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrengthInput } from "@/components/ui/password-strength-input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { AnimatedShapesBackground } from "@/components/animated-shapes-background";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm();
  const router = useRouter();

  const password = watch("password");

  const onSubmit = async (formData) => {
    try {
      // Vérifier si l'utilisateur existe déjà
      const checkResponse = await fetch("/api/auth/check-existing-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const checkData = await checkResponse.json();
      
      // Si l'utilisateur existe déjà
      if (checkData.exists) {
        // Si déjà partenaire, rediriger vers login
        if (checkData.isPartner) {
          toast.info("Vous êtes déjà partenaire. Connectez-vous avec vos identifiants.");
          router.push("/auth/login");
          return;
        }
        
        // Sinon, mettre à jour le statut partenaire
        const updateResponse = await fetch("/api/auth/update-partner-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });
        
        if (updateResponse.ok) {
          toast.success("Votre compte Newbi a été converti en compte partenaire ! Connectez-vous avec vos identifiants habituels.");
          router.push("/auth/login?converted=true");
          return;
        } else {
          toast.error("Erreur lors de la conversion du compte");
          return;
        }
      }
      
      // Si l'utilisateur n'existe pas, créer un nouveau compte
      const { data, error } = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        callbackURL: "/auth/login",
      }, {
        onSuccess: async () => {
          toast.success("Compte créé avec succès ! Vérifiez votre email pour confirmer votre inscription.");
          router.push("/auth/login?verified=pending");
        },
        onError: (err) => {
          const errorMessage = err?.message || "Erreur lors de la création du compte";
          toast.error(errorMessage);
        },
      });

      if (error) {
        let errorMessage = "Erreur lors de l'inscription";

        if (error.message) {
          errorMessage = error.message;
        } else if (error.statusText) {
          errorMessage = error.statusText;
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        toast.error(errorMessage);
      }
    } catch {
      toast.error("Erreur lors de l'inscription");
    }
  };

  return (
    <form
      action="#"
      method="post"
      className="mt-6 space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label htmlFor="name" className="text-sm font-medium text-white">
          Nom complet
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Votre nom"
          className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40"
          {...register("name", {
            required: "Le nom est requis",
            minLength: {
              value: 2,
              message: "Le nom doit contenir au moins 2 caractères",
            },
          })}
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium text-white">
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
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Mot de passe est requis",
            minLength: {
              value: 8,
              message: "Le mot de passe doit contenir au moins 8 caractères",
            },
          }}
          render={({ field }) => (
            <PasswordStrengthInput
              {...field}
              label="Mot de passe"
              error={errors.password?.message}
            />
          )}
        />
      </div>

      <div>
        <InputPassword
          label="Confirmer le mot de passe"
          placeholder="Confirmez votre mot de passe"
          autoComplete="new-password"
          {...register("confirmPassword", {
            required: "Veuillez confirmer votre mot de passe",
            validate: (value) =>
              value === password || "Les mots de passe ne correspondent pas",
          })}
        />
        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="mt-4 w-full py-2 font-normal cursor-pointer bg-[#5b50FF] hover:bg-[#5b50FF]/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création du compte...
          </>
        ) : (
          "Créer mon compte partenaire"
        )}
      </Button>
    </form>
  );
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden">
      {/* Animated Background Shapes */}
      <AnimatedShapesBackground />

      <main className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-semibold text-white">
              Devenir Partenaire
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-white/60">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-[#5b50FF] hover:text-[#5b50FF]/90"
              >
                Se connecter
              </Link>
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 sm:p-6">
            <SignupForm />
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

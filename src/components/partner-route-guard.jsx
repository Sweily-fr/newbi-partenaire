"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function PartnerRouteGuard({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      // Si pas de session, rediriger vers login
      if (!session) {
        router.push("/auth/login");
        return;
      }

      // Si l'utilisateur n'est pas un partenaire, bloquer l'accès
      if (!session.user?.isPartner) {
        router.push("/access-denied");
        return;
      }
    }
  }, [session, isPending, router]);

  // Afficher un loader pendant la vérification
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si pas de session ou pas partenaire, ne rien afficher
  if (!session || !session.user?.isPartner) {
    return null;
  }

  // Utilisateur authentifié et partenaire, afficher le contenu
  return <>{children}</>;
}

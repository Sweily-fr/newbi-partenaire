"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { isAdmin } from "@/src/lib/admin-utils";
import { WithdrawalsManagement } from "@/components/admin/withdrawals-management";

export default function AdminWithdrawalsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && (!session?.user || !isAdmin(session.user))) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b50ff] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session?.user || !isAdmin(session.user)) {
    return null;
  }

  return (
    <>
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Gestion des retraits</h1>
        <p className="text-muted-foreground mt-2">
          Administration des demandes de retrait des partenaires
        </p>
      </div>
      
      <WithdrawalsManagement />
    </>
  );
}

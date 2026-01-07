"use client";

import { useQuery } from "@apollo/client/react";
import { GET_PARTNER_STATS } from "@/src/graphql/partner";
import { ReferralsTable } from "@/components/referrals-table";
import { StatsCard } from "@/components/stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Euro, TrendingUp, Users, Percent } from "lucide-react";

export default function ReferralsPage() {
  const { data, loading } = useQuery(GET_PARTNER_STATS);
  const stats = data?.getPartnerStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold">Mes Filleuls</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Liste des utilisateurs inscrits avec votre code de parrainage
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Gains Totaux"
            value={`${(stats?.totalEarnings || 0).toFixed(2)} €`}
            change={stats?.totalEarnings > 0 ? "Confirmé" : "Aucun gain"}
            changeType={stats?.totalEarnings > 0 ? "positive" : "neutral"}
            icon={Euro}
          />
          <StatsCard
            title="CA Apporté"
            value={`${(stats?.totalRevenue || 0).toFixed(2)} €`}
            change={stats?.totalRevenue > 0 ? "Total généré" : "Aucun CA"}
            changeType={stats?.totalRevenue > 0 ? "positive" : "neutral"}
            icon={TrendingUp}
          />
          <StatsCard
            title="Filleuls Actifs"
            value={stats?.activeReferrals?.toString() || "0"}
            change={`${stats?.totalReferrals || 0} total`}
            changeType="neutral"
            icon={Users}
          />
          <StatsCard
            title="Taux de Commission"
            value={`${stats?.commissionRate || 0}%`}
            change={`Niveau ${stats?.currentTier || "Bronze"}`}
            icon={Percent}
          />
        </div>
      )}

      {/* Table */}
      <ReferralsTable />
    </div>
  );
}

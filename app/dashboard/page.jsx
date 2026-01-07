"use client";

import { useSession } from "@/src/lib/auth-client";
import { useQuery } from "@apollo/client/react";
import { GET_PARTNER_STATS } from "@/src/graphql/partner";
import { StatsCard } from "@/components/stats-card";
import { EarningsChart } from "@/components/earnings-chart";
import { RevenueChart } from "@/components/revenue-chart";
import { CommissionTiers } from "@/components/commission-tiers";
import { WithdrawalCard } from "@/components/withdrawal-card";
import { WithdrawalHistory } from "@/components/withdrawal-history";
import { ReferralLinkDisplay } from "@/components/referral-link-display";
import { Euro, TrendingUp, Users, Percent } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data, loading, error } = useQuery(GET_PARTNER_STATS);

  // Debug: afficher l'erreur dans la console
  if (error) {
    console.error('Erreur GraphQL:', error);
    console.error('Network error:', error.networkError);
    console.error('GraphQL errors:', error.graphQLErrors);
  }

  const stats = data?.getPartnerStats;

  return (
    <>
      {/* Welcome Section */}
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              Bonjour, {session?.user?.name || session?.user?.email}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Bienvenue dans votre espace partenaire Newbi
            </p>
          </div>
          <div className="w-full lg:w-auto lg:min-w-[400px]">
            <ReferralLinkDisplay 
              userEmail={session?.user?.email}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Gains Totaux"
              value={`${stats?.totalEarnings?.toFixed(2) || '0.00'} €`}
              change={stats?.totalEarnings > 0 ? `${stats?.activeReferrals || 0} filleuls` : 'Aucun gain'}
              changeType={stats?.totalEarnings > 0 ? "positive" : "neutral"}
              icon={Euro}
            />
            <StatsCard
              title="CA Apporté"
              value={`${stats?.totalRevenue?.toFixed(2) || '0.00'} €`}
              change={stats?.totalReferrals > 0 ? `${stats?.totalReferrals} filleuls total` : 'Aucun filleul'}
              changeType={stats?.totalRevenue > 0 ? "positive" : "neutral"}
              icon={TrendingUp}
            />
            <StatsCard
              title="Filleuls Actifs"
              value={stats?.activeReferrals?.toString() || '0'}
              change={stats?.totalReferrals > 0 ? `${stats?.totalReferrals} au total` : 'Aucun filleul'}
              changeType={stats?.activeReferrals > 0 ? "positive" : "neutral"}
              icon={Users}
            />
            <StatsCard
              title="Taux de Commission"
              value={`${stats?.commissionRate || 20}%`}
              change={`Niveau ${stats?.currentTier || 'Bronze'}`}
              icon={Percent}
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {loading ? (
          <>
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </>
        ) : (
          <>
            <EarningsChart data={stats?.earningsHistory || []} />
            <RevenueChart data={stats?.revenueHistory || []} />
          </>
        )}
      </div>

      {/* Withdrawal and Commission Tiers */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <>
              <Skeleton className="h-96" />
              <Skeleton className="h-64" />
            </>
          ) : (
            <>
              <WithdrawalCard 
                availableBalance={stats?.availableBalance || 0}
                totalEarnings={stats?.totalEarnings || 0}
              />
              <WithdrawalHistory withdrawals={stats?.withdrawals || []} />
            </>
          )}
        </div>
        <div className="lg:col-span-2">
          {loading ? (
            <Skeleton className="h-96" />
          ) : (
            <CommissionTiers 
              currentTier={stats?.currentTier || 'Bronze'} 
              currentCA={stats?.totalRevenue || 0}
              nextTier={stats?.nextTier}
              progress={stats?.progressToNextTier || 0}
            />
          )}
        </div>
      </div>
    </>
  );
}

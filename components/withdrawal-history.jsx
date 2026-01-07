"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const statusConfig = {
  pending: {
    label: "En attente",
    variant: "secondary",
    icon: Clock,
    color: "text-yellow-600",
  },
  processing: {
    label: "En cours",
    variant: "default",
    icon: Loader2,
    color: "text-blue-600",
  },
  completed: {
    label: "Complété",
    variant: "success",
    icon: CheckCircle2,
    color: "text-green-600",
  },
  cancelled: {
    label: "Annulé",
    variant: "destructive",
    icon: XCircle,
    color: "text-red-600",
  },
};

export function WithdrawalHistory({ withdrawals = [] }) {
  if (!withdrawals || withdrawals.length === 0) {
    return (
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Historique des retraits</CardTitle>
          <CardDescription className="text-sm">
            Vos demandes de retrait apparaîtront ici
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-center text-muted-foreground text-sm py-8">
            Aucune demande de retrait pour le moment
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Historique des retraits</CardTitle>
        <CardDescription className="text-sm">
          Suivez l'état de vos demandes de retrait
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-3">
        <div className="space-y-3">
          {withdrawals.map((withdrawal) => {
            const config = statusConfig[withdrawal.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const date = new Date(withdrawal.requestedAt).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });

            return (
              <div
                key={withdrawal.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`${config.color} flex-shrink-0`}>
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm sm:text-base">
                        {withdrawal.amount.toFixed(2)}€
                      </span>
                      <Badge variant={config.variant} className="text-xs">
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Demandé le {date}
                    </p>
                    {withdrawal.processedAt && (
                      <p className="text-xs text-muted-foreground">
                        Traité le{" "}
                        {new Date(withdrawal.processedAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

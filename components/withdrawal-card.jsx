"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { REQUEST_WITHDRAWAL, GET_PARTNER_STATS } from "@/src/graphql/partner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownToLine } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/src/lib/auth-client";
import { useProfileModal } from "@/src/contexts/profile-modal-context";

export function WithdrawalCard({ availableBalance = 0, totalEarnings = 0 }) {
  const { data: session } = useSession();
  const { setIsOpen: setProfileModalOpen } = useProfileModal();
  const [amount, setAmount] = useState("");
  const [requestWithdrawal, { loading: isLoading }] = useMutation(REQUEST_WITHDRAWAL, {
    refetchQueries: [{ query: GET_PARTNER_STATS }],
  });

  // Vérifier si on est dans la période de retrait autorisée (28 au 5)
  const isWithdrawalPeriod = () => {
    const today = new Date();
    const day = today.getDate();
    // Période autorisée : du 28 du mois en cours au 5 du mois suivant
    return day >= 28 || day <= 5;
  };

  // Calculer la prochaine date de retrait disponible
  const getNextWithdrawalDate = () => {
    const today = new Date();
    const day = today.getDate();
    
    if (day >= 28) {
      // Si on est après le 28, la prochaine période est déjà en cours
      return null;
    } else if (day <= 5) {
      // Si on est avant le 5, la période en cours se termine le 5
      return null;
    } else {
      // Sinon, la prochaine période commence le 28 de ce mois
      const nextDate = new Date(today.getFullYear(), today.getMonth(), 28);
      return nextDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    }
  };

  const canWithdraw = isWithdrawalPeriod();
  const nextDate = getNextWithdrawalDate();

  const handleWithdrawal = async () => {
    const withdrawalAmount = parseFloat(amount);

    if (!amount || withdrawalAmount <= 0) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }

    if (withdrawalAmount < 50) {
      toast.error("Le montant minimum de retrait est de 50€");
      return;
    }

    if (withdrawalAmount > availableBalance) {
      toast.error("Montant supérieur au solde disponible");
      return;
    }

    try {
      const { data } = await requestWithdrawal({
        variables: {
          amount: withdrawalAmount,
          method: "bank_transfer",
        },
      });

      if (data?.requestWithdrawal?.success) {
        // Envoi des emails de notification
        try {
          const emailResponse = await fetch('/api/emails/send-withdrawal-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              partnerName: session?.user?.name || session?.user?.email,
              partnerEmail: session?.user?.email,
              partnerId: session?.user?.id,
              amount: withdrawalAmount,
              requestDate: new Date().toLocaleDateString('fr-FR'),
              withdrawalId: data.requestWithdrawal.withdrawal?.id || 'N/A',
              bankDetails: data.requestWithdrawal.withdrawal?.bankDetails || {
                iban: '****',
                bic: '****',
                accountHolder: session?.user?.name || 'Non renseigné',
              },
              availableBalance: availableBalance,
              totalEarnings: totalEarnings,
            }),
          });

          if (!emailResponse.ok) {
            console.error('Erreur lors de l\'envoi des emails:', await emailResponse.text());
            // On ne bloque pas le processus si l'email échoue
            toast.warning('Demande enregistrée mais erreur lors de l\'envoi des emails de confirmation');
          } else {
            toast.success(data.requestWithdrawal.message + ' - Emails de confirmation envoyés');
          }
        } catch (emailError) {
          console.error('Erreur email:', emailError);
          // On ne bloque pas le processus si l'email échoue
          toast.warning('Demande enregistrée mais erreur lors de l\'envoi des emails de confirmation');
        }
        
        setAmount("");
      } else {
        toast.error("Erreur lors de la demande de retrait");
      }
    } catch (error) {
      console.error("Erreur retrait:", error);
      toast.error(error.message || "Erreur lors de la demande de retrait");
    }
  };

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="p-4 pb-0 sm:pb-0 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          Retirer mes Gains
        </CardTitle>
        <CardDescription className="text-sm space-y-1">
          <div>
            Solde disponible : <span className="font-semibold text-foreground">{availableBalance.toFixed(2)}€</span>
          </div>
          <div className="text-xs">
            Gains totaux : {totalEarnings.toFixed(2)}€
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Montant à retirer</Label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              max={availableBalance}
              step="0.01"
            />
            <Button
              variant="outline"
              onClick={() => setAmount(availableBalance.toString())}
            >
              Max
            </Button>
          </div>
        </div>

        <Button 
          className="w-full bg-[#5b50ff] hover:bg-[#4a3fee] text-white" 
          onClick={handleWithdrawal}
          disabled={isLoading || !canWithdraw}
        >
          <ArrowDownToLine className="h-4 w-4 mr-2" />
          {isLoading ? "Traitement..." : "Demander le retrait"}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Montant minimum : 50€</p>
          <p>• Délai de traitement : 7 jours ouvrés</p>
          <p>• Période de retrait : du 28 au 5 de chaque mois</p>
          {!canWithdraw && nextDate && (
            <p className="text-orange-600 font-medium">
              ⚠️ Prochaine période de retrait : à partir du {nextDate}
            </p>
          )}
          <p>
            • Virement bancaire sur{" "}
            <button
              type="button"
              onClick={() => setProfileModalOpen(true)}
              className="text-[#5b50ff] hover:underline cursor-pointer"
            >
              votre compte enregistré
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

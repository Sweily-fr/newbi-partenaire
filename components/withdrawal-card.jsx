"use client";

import { useState, useRef } from "react";
import { useMutation } from "@apollo/client/react";
import { REQUEST_WITHDRAWAL, GET_PARTNER_STATS } from "@/src/graphql/partner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownToLine, Upload, FileText, Download, X } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/src/lib/auth-client";
import { useProfileModal } from "@/src/contexts/profile-modal-context";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export function WithdrawalCard({ availableBalance = 0, totalEarnings = 0 }) {
  const { data: session } = useSession();
  const { setIsOpen: setProfileModalOpen } = useProfileModal();
  const [amount, setAmount] = useState("");
  const [invoiceType, setInvoiceType] = useState("particulier");
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [invoiceBase64, setInvoiceBase64] = useState(null);
  const fileInputRef = useRef(null);
  const [requestWithdrawal, { loading: isLoading }] = useMutation(REQUEST_WITHDRAWAL, {
    refetchQueries: [{ query: GET_PARTNER_STATS }],
  });

  // Vérifier si on est dans la période de retrait autorisée (28 au 5)
  const isWithdrawalPeriod = () => {
    const today = new Date();
    const day = today.getDate();
    return day >= 28 || day <= 5;
  };

  // Calculer la prochaine date de retrait disponible
  const getNextWithdrawalDate = () => {
    const today = new Date();
    const day = today.getDate();

    if (day >= 28 || day <= 5) {
      return null;
    } else {
      const nextDate = new Date(today.getFullYear(), today.getMonth(), 28);
      return nextDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    }
  };

  const canWithdraw = isWithdrawalPeriod();
  const nextDate = getNextWithdrawalDate();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Format non supporté. Formats acceptés : PDF, JPG, PNG");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Le fichier est trop volumineux (max 5 Mo)");
      e.target.value = "";
      return;
    }

    setInvoiceFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      setInvoiceBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setInvoiceFile(null);
    setInvoiceBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    const withdrawalAmount = parseFloat(amount) || 0;
    const partnerName = session?.user?.name || session?.user?.email || "";
    const url = `/api/generate-invoice-template?partnerName=${encodeURIComponent(partnerName)}&amount=${withdrawalAmount.toFixed(2)}&type=${invoiceType}`;
    window.open(url, "_blank");
  };

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

    if (!invoiceFile || !invoiceBase64) {
      toast.error("Veuillez joindre un justificatif (facture ou reçu)");
      return;
    }

    try {
      const { data } = await requestWithdrawal({
        variables: {
          amount: withdrawalAmount,
          method: "bank_transfer",
          hasInvoice: true,
        },
      });

      if (data?.requestWithdrawal?.success) {
        // Envoi des emails de notification avec pièce jointe
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
              invoiceFile: invoiceBase64,
              invoiceFileName: invoiceFile.name,
            }),
          });

          if (!emailResponse.ok) {
            console.error('Erreur lors de l\'envoi des emails:', await emailResponse.text());
            toast.warning('Demande enregistrée mais erreur lors de l\'envoi des emails de confirmation');
          } else {
            toast.success(data.requestWithdrawal.message + ' - Emails de confirmation envoyés');
          }
        } catch (emailError) {
          console.error('Erreur email:', emailError);
          toast.warning('Demande enregistrée mais erreur lors de l\'envoi des emails de confirmation');
        }

        setAmount("");
        removeFile();
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

        {/* Justificatif upload */}
        <div className="space-y-2">
          <Label>Justificatif (facture ou reçu) *</Label>

          {!invoiceFile ? (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center cursor-pointer hover:border-[#5b50ff]/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Cliquez pour uploader votre justificatif
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, JPG ou PNG (max 5 Mo)
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <FileText className="h-5 w-5 text-[#5b50ff] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{invoiceFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(invoiceFile.size / 1024).toFixed(0)} Ko
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex items-center gap-4 text-xs">
            <span className="text-muted-foreground">Type de facture :</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="invoiceType"
                value="particulier"
                checked={invoiceType === "particulier"}
                onChange={(e) => setInvoiceType(e.target.value)}
                className="accent-[#5b50ff]"
              />
              Particulier
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="invoiceType"
                value="pro"
                checked={invoiceType === "pro"}
                onChange={(e) => setInvoiceType(e.target.value)}
                className="accent-[#5b50ff]"
              />
              Professionnel
            </label>
          </div>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 text-xs text-[#5b50ff] hover:underline cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Télécharger le modèle de facture pré-rempli
          </button>
        </div>

        <Button
          className="w-full bg-[#5b50ff] hover:bg-[#4a3fee] text-white"
          onClick={handleWithdrawal}
          disabled={isLoading || !canWithdraw || !invoiceFile}
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
              Prochaine période de retrait : à partir du {nextDate}
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

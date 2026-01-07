"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, CreditCard, Building2, Hash } from "lucide-react";
import { toast } from "sonner";
import { updateUser, useSession, authClient } from "@/src/lib/auth-client";

export function PartnerProfileModal({ open, onOpenChange, user }) {
  const { refetch } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankIban, setBankIban] = useState("");
  const [displayIban, setDisplayIban] = useState(""); // IBAN formaté pour l'affichage
  const [bankBic, setBankBic] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeOrg, setActiveOrg] = useState(null);

  // Fonction pour formater l'IBAN avec des espaces tous les 4 caractères
  const formatIban = (iban) => {
    if (!iban) return "";
    const cleaned = iban.replace(/\s/g, "").toUpperCase();
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  // Fonction pour gérer la saisie de l'IBAN
  const handleIbanChange = (e) => {
    const input = e.target.value;
    const cleaned = input.replace(/\s/g, "").toUpperCase();
    const formatted = formatIban(cleaned);
    
    setDisplayIban(formatted);
    setBankIban(cleaned); // Stocker sans espaces
  };

  // Charger les données utilisateur et organisation
  useEffect(() => {
    const loadData = async () => {
      // Charger les données utilisateur
      if (user) {
        setName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phoneNumber || user.phone || "");
      }

      // Charger les données de l'organisation et les coordonnées bancaires
      if (open) {
        try {
          console.log("🔍 Récupération de l'organisation...");
          const { data: orgs } = await authClient.organization.list();
          console.log("📋 Organisations:", orgs);
          
          if (orgs && orgs.length > 0) {
            const org = orgs[0];
            setActiveOrg(org);
            console.log("✅ Organisation chargée:", org);

            // Récupérer les coordonnées bancaires depuis MongoDB via l'API
            try {
              const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/graphql', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                  query: `
                    query GetOrganizationBankDetails($organizationId: ID!) {
                      getOrganizationBankDetails(organizationId: $organizationId) {
                        bankName
                        bankIban
                        bankBic
                      }
                    }
                  `,
                  variables: {
                    organizationId: org.id,
                  },
                }),
              });

              const result = await response.json();
              if (result.data?.getOrganizationBankDetails) {
                const details = result.data.getOrganizationBankDetails;
                console.log("📋 Coordonnées bancaires chargées depuis MongoDB:", details);
                setBankName(details.bankName || "");
                setBankIban(details.bankIban || "");
                setDisplayIban(formatIban(details.bankIban || ""));
                setBankBic(details.bankBic || "");
              }
            } catch (apiError) {
              console.error("❌ Erreur récupération coordonnées bancaires:", apiError);
              // Fallback sur localStorage
              const savedBankDetails = localStorage.getItem('partner_bank_details');
              if (savedBankDetails) {
                try {
                  const details = JSON.parse(savedBankDetails);
                  console.log("📋 Coordonnées bancaires chargées depuis localStorage (fallback):", details);
                  setBankName(details.bankName || "");
                  setBankIban(details.iban || "");
                  setBankBic(details.bic || "");
                } catch (e) {
                  console.error("❌ Erreur parsing coordonnées bancaires:", e);
                }
              }
            }
          }
        } catch (error) {
          console.error("❌ Erreur récupération organisation:", error);
        }
      }
    };

    loadData();
  }, [open, user]);

  const getUserInitials = (name) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Générer le code de parrainage à partir de l'email
  const generateReferralCode = (email) => {
    if (!email) return "partner";
    // Prendre la partie avant @ et la convertir en minuscules
    const username = email.split("@")[0].toLowerCase();
    // Limiter à 10 caractères et remplacer les caractères spéciaux
    return username.replace(/[^a-z0-9]/g, "").slice(0, 10);
  };

  const referralCode = generateReferralCode(user?.email);

  const handleCopyReferralLink = () => {
    const referralLink = `https://www.newbi.fr/auth/signup?partner=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast.success("Lien de parrainage copié !");
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validation des coordonnées bancaires
      const hasBankInfo = bankName.trim() || bankIban.trim() || bankBic.trim();
      if (hasBankInfo && (!bankName.trim() || !bankIban.trim() || !bankBic.trim())) {
        toast.error("Si vous renseignez des coordonnées bancaires, tous les champs sont obligatoires");
        setIsSaving(false);
        return;
      }

      // Préparer les données utilisateur à mettre à jour
      const updateData = {
        name: name.trim(),
        phoneNumber: phone.trim(),
      };

      // Mettre à jour via Better Auth
      await updateUser(updateData, {
        onSuccess: async () => {
          toast.success("Profil mis à jour avec succès");
          
          // Mettre à jour les coordonnées bancaires via GraphQL
          if (hasBankInfo && activeOrg) {
            try {
              const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/graphql', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                  query: `
                    mutation UpdateOrganizationBankDetails($organizationId: ID!, $bankName: String!, $bankIban: String!, $bankBic: String!) {
                      updateOrganizationBankDetails(
                        organizationId: $organizationId
                        bankName: $bankName
                        bankIban: $bankIban
                        bankBic: $bankBic
                      ) {
                        success
                        message
                      }
                    }
                  `,
                  variables: {
                    organizationId: activeOrg.id,
                    bankName: bankName.trim(),
                    bankIban: bankIban.trim().replace(/\s/g, "").toUpperCase(),
                    bankBic: bankBic.trim().toUpperCase(),
                  },
                }),
              });

              const result = await response.json();
              if (result.data?.updateOrganizationBankDetails?.success) {
                console.log("✅ Coordonnées bancaires mises à jour en BDD");
                toast.success("Coordonnées bancaires enregistrées");
              } else {
                console.error("❌ Erreur API:", result);
                toast.warning("Profil mis à jour mais erreur sur les coordonnées bancaires");
              }
            } catch (apiError) {
              console.error("❌ Erreur mise à jour coordonnées bancaires:", apiError);
              toast.warning("Profil mis à jour mais erreur sur les coordonnées bancaires");
            }
          }
          
          // Recharger la session pour refléter les changements
          await refetch();
          onOpenChange(false);
        },
        onError: (error) => {
          console.error("Erreur mise à jour:", error);
          toast.error("Erreur lors de la mise à jour du profil");
        },
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="h-[85vh] p-0 flex flex-col overflow-hidden"
        style={{
          maxWidth: "60rem",
          width: "90vw",
        }}
      >
        <div className="p-6 border-b">
          <DialogTitle className="text-xl font-semibold">Mon Profil Partenaire</DialogTitle>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
          {/* Avatar et informations de base */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={user?.name} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-[#5b50ff] text-white text-2xl">
                  {getUserInitials(user?.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{user?.name || "Partenaire"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <Separator />

          {/* Informations personnelles */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">
              Informations personnelles
            </h4>

            <div className="space-y-4">
              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <Label htmlFor="name" className="text-right">Nom complet</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                />
              </div>

              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>

              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <Label htmlFor="phone" className="text-right">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Coordonnées bancaires */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">
              Coordonnées bancaires
            </h4>

            <div className="space-y-4">
              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <Label htmlFor="bankName" className="text-right flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Nom de la banque
                </Label>
                <Input
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="BNP Paribas"
                />
              </div>

              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <Label htmlFor="bankIban" className="text-right flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  IBAN
                </Label>
                <Input
                  id="bankIban"
                  value={displayIban}
                  onChange={handleIbanChange}
                  placeholder="FR76 1234 5678 9012 3456 7890 123"
                />
              </div>

              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <Label htmlFor="bankBic" className="text-right flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  BIC/SWIFT
                </Label>
                <Input
                  id="bankBic"
                  value={bankBic}
                  onChange={(e) => setBankBic(e.target.value)}
                  placeholder="BNPAFRPP"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Ces coordonnées seront utilisées pour vos virements de retrait. Si vous renseignez une information, tous les champs sont obligatoires.
            </p>
          </div>

          <Separator />

          {/* Informations de parrainage */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">
              Lien de parrainage
            </h4>

            <div className="space-y-4">
              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <Label className="text-right">Code de parrainage</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-muted/50 rounded-md text-sm font-mono">
                    {referralCode}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyReferralLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <Label className="text-right">Lien complet</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={`https://www.newbi.fr/auth/signup?partner=${referralCode}`}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyReferralLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Footer fixe avec boutons */}
        <div className="p-4 border-t bg-background flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-[#5b50ff] hover:bg-[#4a3fee] text-white"
            disabled={isSaving}
          >
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
